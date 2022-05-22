import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import {sessionStoreCallback , sessionLoadCallback, sessionDeleteCallback} from './session-store';
// import {sessionStoreCallback , sessionLoadCallback, sessionDeleteCallback} from './redis-store';
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import setStoreAccount from "./api/set-store-account";
import appRouter from "./router";
import deleteStoreAccounts from "./lib/dynamoDB/delete-store-account";
import getStoreAccount from "./lib/dynamoDB/get-store-account";
import verifyWebhook from "./lib/security/verifyWebhook";
import processGDPR from "./lib/configs/process-GDPR";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: process.env.SHOPIFY_API_VERSION,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    sessionStoreCallback,
    sessionLoadCallback,
    sessionDeleteCallback,
  ),
});
const ACTIVE_SHOPIFY_SHOPS = {};
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(cors());
  server.use(async (ctx, next) => {
    ctx.set("Content-Security-Policy", `frame-ancestors https://${ctx.state?.shopify?.shop || ctx.query?.shop} https://admin.shopify.com`);
    await next();
  });
  const accessMode = "offline";
  server.use(
    createShopifyAuth({
      accessMode,
      async afterAuth(ctx) {
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });
        if (!response["APP_UNINSTALLED"]?.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${JSON.stringify(response)}`
          );
        }
        try {
          await setStoreAccount(process.env.STORE_ACCOUNT_TABLENAME, {myshopifyDomain: shop, accessToken, scope, accessMode, host});
        } catch (error) {
          console.error("[Error] setStoreAccount:", error);
        }
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
  router.post("/webhooks", async (ctx) => {
    try {
      await verifyWebhook(ctx);
      const shop = ctx.request?.header["x-shopify-shop-domain"];
      console.log("shop:", shop);
      await deleteStoreAccounts(process.env.STORE_ACCOUNT_TABLENAME, shop);
      delete ACTIVE_SHOPIFY_SHOPS[shop];
      // await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      ctx.status = 200;
      ctx.body = "ok";
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      ctx.body = error;
    }
    return null;
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  appRouter(router);
  processGDPR(router);

  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // console.log("accessToken: ", await Shopify.Utils.loadOfflineSession(shop));
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      // グローバル変数に値がない場合、DBを参照しにいく
      const storeData = await getStoreAccount(process.env.STORE_ACCOUNT_TABLENAME, shop);
      if (storeData) {
        ACTIVE_SHOPIFY_SHOPS[shop] = storeData.scope;
        await handleRequest(ctx);
      }else{
        ctx.redirect(`/auth?shop=${shop}`);
      }
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

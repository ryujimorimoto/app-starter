import deleteData from "../dynamoDB/delete-data";
import deleteStoreAccounts from "../dynamoDB/delete-store-account";
import queryData from "../dynamoDB/query-data";
import verifyWebhook from "../security/verifyWebhook";

  /**
   * GDPR準拠
   */
export default function processGDPR(router) {
  // 動作テスト用
  console.log("========== process-GDPR =========")
  router.post("/customers/data_request", async (ctx) => {
    console.log("============= POST /customers/data_request =============");
    try {
      console.log(
        "顧客データは取得しているので、保存してある対象の顧客データをJSONで返す"
      );
      await verifyWebhook(ctx);
      console.log("ctx:", JSON.stringify(ctx, null, 2));
      const queryParams = {
        TableName: process.env.RECENTLY_PRODUCT_DATA_TABLENAME,
        KeyConditionExpression: "myshopifyDomain = :myshopifyDomain",
        ExpressionAttributeValues: {
          ":myshopifyDomain": ctx.shop_domain,
          customerId: ctx.customer.id,
        },
      };
      const rows = await queryData(queryParams);
      ctx.body = {
        status: 200,
        message: "success",
        data: { rows },
      };
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      ctx.body = {
        status: 500,
        message: "failed",
      };
      console.log(`Failed to process post webhook: ${error}`);
    }
  });
  router.post("/customers/redact", async (ctx) => {
    console.log("============= POST /customers/redact =============");
    try {
      console.log(
        "顧客データは取得しているので、保存してある対象の顧客データを削除する"
      );
      console.log("ctx:", JSON.stringify(ctx, null, 2));
      await verifyWebhook(ctx);
      const deleteParams = {
        TableName: process.env.RECENTLY_PRODUCT_DATA_TABLENAME,
        Key: {
          myshopifyDomain: ctx.shop_domain,
          customerId: ctx.customer.id,
        }
      }
      console.log("[Info] deleteParams:", deleteParams);
      await deleteData(deleteParams);

      ctx.body = {
        status: 200,
        message: "success",
      };
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      ctx.body = {
        status: 500,
        message: "failed",
      };
      console.log(`Failed to process post webhook: ${error}`);
    }
  });
  router.post("/shop/redact", async (ctx) => {
    console.log("============= POST /shop/redact =============");
    try {
      console.log("ctx:", JSON.stringify(ctx, null, 2));
      await verifyWebhook(ctx);
      await deleteStoreAccounts(process.env.STORE_ACCOUNT_TABLENAME, ctx.shop_domain);
      ctx.body = {
        status: 200,
        message: "success",
      };
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      ctx.body = {
        status: 500,
        message: "failed",
      };
      console.log(`Failed to process post webhook: ${error}`);
    }
  });
  /**
   * GDPR準拠
   * 処理終了
   */
}

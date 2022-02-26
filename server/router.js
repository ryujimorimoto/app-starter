import testApi from "./api/test-get"
import koaBody from "koa-body"
console.log("========== app-router =========")
export default function appRouter(router) {
  // 動作テスト用
  router.get("/api/test-get", (ctx) => testApi(ctx));
  router.post("/api/test-post", koaBody(), (ctx) => testApi(ctx));
}

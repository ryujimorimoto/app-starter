export default async function testPost(ctx){
  console.log("------- api/test-post check --------")
  const body = ctx.request.body
  ctx.body = "post ok"
}

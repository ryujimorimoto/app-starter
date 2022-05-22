import crypto from "crypto";
export default function verifyWebhook(ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      const hmac = ctx.request.headers['x-shopify-hmac-sha256'];
      const data = await getDataForWebhook(ctx);
      console.log("verifyWebhook data:", data);
      console.log("typeof data:", typeof data);
      const hash = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(data).digest('base64');
      console.log("verifyWebhook result:", hmac === hash);
      if (hmac === hash) {
        resolve(true);
      } else {
        ctx.status = 401;
        reject(false);
      }
    } catch (error) {
      console.log("[Error] verifyWebhook:", error);
      reject(error);
    }
  });
}

function getDataForWebhook(ctx){
  return new Promise((resolve, reject) => {
    try {
      let str = '';
      try {
        ctx.req.on('data', function(data) {
          str += data;
        });
        ctx.req.on('end', function(chunk) {
          resolve(str);
        });
      } catch (e) {
        str = '{}';
        reject(e);
      }
    } catch (error) {
      reject(error);
    }
  });
}

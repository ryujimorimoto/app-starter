import queryData from "./query-data";

export default async function getStoreAccount(TableName, shop) {
  const params = {
    TableName,
    KeyConditionExpression: "myshopifyDomain = :myshopifyDomain",
    ExpressionAttributeValues: {
      ":myshopifyDomain": shop,
    },
  }
  const results = await queryData(params);
  if(results.error) {
    console.log("[Error] getStoreAccount:", results.error);
    throw new Error(results.error);
  }else{
    console.log("[Info] getStoreAccount:", results[0]);
  }
  return results[0];
}

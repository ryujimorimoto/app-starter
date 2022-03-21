import deleteData from "./delete-data";

export default async function deleteStoreAccounts(TableName, myshopifyDomain) {
  const params = { TableName, Key: {myshopifyDomain}};
  console.log("delete params:", params);
  const result = await deleteData(params);
  if(result.error) {
    console.log("[Error] deleteAccount:", result.error);
    throw new Error(result.error);
  }
  return result;
}

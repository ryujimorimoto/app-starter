import { docClient } from "../aws-config";
import putData from "./put-data";

export default async function setStoreAccount(TableName, Item) {
  const result = await putData(TableName, Item);
  if(result.error) {
    console.log("[Error] putAccount:", result.error);
    throw new Error(result.error);
  }
  return result;
}

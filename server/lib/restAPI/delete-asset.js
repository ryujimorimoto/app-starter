import { RestClient, DataType } from "./rest-api";

export default async function deleteAsset({ shop, themeId, fileName }) {
  const client = await RestClient(shop);
  const params = {
    path: `themes/${themeId}/assets`,
    query: { "asset[key]": fileName },
    type: DataType.JSON,
  };
  const { message } = await client.delete(params);
  console.log(`[Success] ${fileName} Deleted:`, message);
  return message;
}

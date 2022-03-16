import { RestClient, DataType } from "./rest-api";

export default async function getAssets({ shop, themeId, fileName = null }) {
  const client = await RestClient(shop);
  const params = fileName
    ? {
        path: `themes/${themeId}/assets`,
        query: { "asset[key]": fileName },
        dataType: DataType.JSON,
      }
    : { path: `themes/${themeId}/assets` };
  const { body } = await client.get(params);
  return fileName ? body.asset || null : body.assets || null;
}

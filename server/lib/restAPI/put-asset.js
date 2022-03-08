import { restClient, DataType } from '../rest-api';

export default async function putAsset({shop, themeId, fileName, fileData}) {
  const client = await restClient(shop);
  const params =  {
      path: `themes/${themeId}/assets`,
      data: { "asset": {
        "key": fileName,
        "value": fileData
      }},
      type: DataType.JSON
    }
  const { body } = await client.put(params);
  return body.asset;
}

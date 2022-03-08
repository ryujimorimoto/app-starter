import Shopify, { DataType } from "@shopify/shopify-api";
const restClient = async (shop) => {
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const accessToken = session.accessToken;
  return new Shopify.Clients.Rest(shop, accessToken)
};


module.exports = {
  restClient,
  DataType,
}

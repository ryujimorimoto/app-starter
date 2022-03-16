import Shopify, { DataType } from "@shopify/shopify-api";
const RestClient = async (shop) => {
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const accessToken = session.accessToken;
  return new Shopify.Clients.Rest(shop, accessToken);
};

module.exports = {
  RestClient,
  DataType,
};

import Shopify from "@shopify/shopify-api";
const GraphqlClient = async (shop) => {
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const accessToken = session?.accessToken;
  return new Shopify.Clients.Graphql(shop, accessToken)
};


module.exports = {
  GraphqlClient,
}

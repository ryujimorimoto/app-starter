import { GraphqlClient } from "./graphql-api";

export default async function gqlQuery({shop, data, variables}) {
  const client = await GraphqlClient(shop);
  const params = { data, variables };
  const result = await client.query(params);
  return result.body.data;
}

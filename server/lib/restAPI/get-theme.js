import { RestClient } from "./rest-api";

export default async function getTheme({ shop, role = "main" }) {
  const client = await RestClient(shop);
  const { body } = await client.get({ path: "themes" });
  const theme = body?.themes?.find((themeData) => themeData.role === role);
  if (!theme) {
    console.log(`No ${role} theme found`);
    return null;
  }
  console.log(`The ${role} theme is:`, theme);
  return theme;
}

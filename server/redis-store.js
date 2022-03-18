import {Session} from '@shopify/shopify-api/dist/auth/session';
import {createClient} from 'redis';
const client = createClient();

(async () => {
  client.on('error', err => console.log('エラーが発生しました：' + err));
  await client.connect();
})();
export const sessionStoreCallback = async (session = Session) => {
  try {
    return await client.set(session.id , JSON.stringify(session));
  } catch (err) {
    throw new Error(err);
  }
};

export const sessionLoadCallback = async (id) => {
  try {
    let reply = await client.get(id);
    if (reply) {
      return JSON.parse(reply);
    } else {
      return undefined;
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const sessionDeleteCallback = async (id) => {
  try {
    return await client.del(id);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  sessionStoreCallback,
  sessionLoadCallback,
  sessionDeleteCallback,
}

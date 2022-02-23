import {Session} from '@shopify/shopify-api/dist/auth/session';
import redis from 'redis';
import {promisify} from 'util';

let client = redis.createClient();

client.on('connect', function() {
  console.log('Redisに接続しました');
});

client.on('error', function (err) {
  console.log('エラーが発生しました：' + err);
});
export const sessionStoreCallback = async (session = Session) => {
  try {
    const setAsync = await promisify(client.set).bind(client);
    return await setAsync(session.id , JSON.stringify(session));
  } catch (err) {
    throw new Error(err);
  }
};

export const sessionLoadCallback = async (id) => {
  try {
    const getAsync = await promisify(client.get).bind(client);
    let reply = await getAsync(id);
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
    const delAsync = await promisify(client.del).bind(client);
    return await delAsync(id);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  sessionStoreCallback,
  sessionLoadCallback,
  sessionDeleteCallback,
}
import {Session} from '@shopify/shopify-api/dist/auth/session';
import fs from 'fs-extra';
const FILE_NAME = "/tmp/session.json";
export const sessionStoreCallback = async (session) => {
  console.log("sessionStoreCallback: ", session);
  try {
    await fs.writeFileSync(FILE_NAME, JSON.stringify(session));
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

export const sessionLoadCallback = async (id) => {
  console.log("sessionLoadCallback: ", id);

  try {
    if (fs.existsSync(FILE_NAME)) {
      const sessionResult = fs.readFileSync(FILE_NAME, "utf8");
      return Object.assign(new Session(), JSON.parse(sessionResult));
    } else {
      return undefined;
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const sessionDeleteCallback = async (id) => {
  console.log("sessionDeleteCallback: ", id);
  try {
    console.log('sessionDeleteCallback');
    const sessionData = await fs.readFileSync(FILE_NAME, "utf-8");
    let sessions = JSON.parse(sessionData);
    delete sessions[id];
    return await fs.writeFileSync(FILE_NAME, sessions, "utf-8");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  sessionStoreCallback,
  sessionLoadCallback,
  sessionDeleteCallback,
}

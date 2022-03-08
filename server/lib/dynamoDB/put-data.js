import { docClient } from "../aws-config";

export default function putData(TableName, Item) {
  return new Promise((resolve, reject) => {
    const params = { TableName, Item };
    docClient.put(params, (error, data) => {
      if (error) {
        reject({error});
      } else {
        resolve(data);
      }
    });
  });
}

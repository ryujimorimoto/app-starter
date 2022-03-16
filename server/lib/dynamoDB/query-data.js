import { docClient } from "../aws-config";

export default function queryData(params) {
  return new Promise((resolve, reject) => {
    docClient.query(params, (error, data) => {
      if (error) {
        reject({error});
      } else {
        resolve(data.Items);
      }
    });
  });
}

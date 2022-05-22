import { docClient } from "../configs/aws-config";

export default function putData({TableName, Item}) {
  return new Promise((resolve, reject) => {
    docClient.put({ TableName, Item }, (error, data) => {
      if (error) {
        reject({error});
      } else {
        resolve(data);
      }
    });
  });
}

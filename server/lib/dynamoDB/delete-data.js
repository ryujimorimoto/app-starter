import { docClient } from "../configs/aws-config";

export default function deleteData(params) {
  return new Promise((resolve, reject) => {
    docClient.delete(params, (error, data) => {
      if (error) {
        reject({error});
      } else {
        resolve(data);
      }
    });
  });
}

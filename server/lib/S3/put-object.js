import { S3 } from "../aws-config";

export default function putObject(S3_BUCKET, fileObject, fileName = fileObject.name || "data.json",  ACL = "public-read") {
  return new Promise((resolve, reject) => {
    const params = {
      ACL,
      Body: fileObject,
      Bucket: S3_BUCKET,
      Key: fileName,
    };
    S3.putObject(params, (error, data) => {
      if (error) {
        console.error("[Error] S3 putObject:", error);
        reject({error});
      } else {
        resolve(data);
      }
    });
  });
}

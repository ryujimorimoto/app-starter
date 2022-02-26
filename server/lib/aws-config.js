import AWS_SDK from 'aws-sdk'
AWS_SDK.config.update({
  region: process.env.AWS_API_REGION,
  accessKeyId: process.env.AWS_API_ACCESS_KEY,
  secretAccessKey: process.env.AWS_API_SECRET_KEY,
});
const docClient = new AWS_SDK.DynamoDB.DocumentClient();
const AWS = AWS_SDK
const S3 = new AWS_SDK.S3({apiVersion: "2006-03-01",}); // 2022年現在、2006-03-01がS3の最新のAPIバージョン
const SES = new AWS.SES({apiVersion: '2010-12-01'})
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
module.exports = {
  AWS,
  docClient,
  S3,
  SES,
  ddb,
}

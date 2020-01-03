import AWS from 'aws-sdk';
import { getDestinationBucketAcl } from './env';

const s3 = new AWS.S3();
const mime = require('mime/lite');

export default function uploadBuffer(
  Bucket: string,
  Key: string,
  Body: Buffer
) {
  console.log(`Uploading ${Key} to ${Bucket}`);

  return {
    uploaded: s3
      .upload({
        Bucket,
        Key,
        Body,
        ACL: getDestinationBucketAcl(),
        ContentType: mime.getType(Key),
      })
      .promise(),
  };
}

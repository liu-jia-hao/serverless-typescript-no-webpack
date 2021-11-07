// Import the required AWS SDK clients and commands for Node.js
import {
  S3,
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// import fetch, { Response } from 'node-fetch';
// Set the AWS Region.
const REGION = 'ap-northeast-1'; // e.g. "us-east-1"
export const IMAGE_BUCKET_NAME = 'images.ap-northeast-1.4082161406';
// Create an Amazon S3 service client object.
export const s3Client = new S3Client({ region: REGION });
export const s3 = new S3({ region: REGION });

export async function createAmazonS3PresignedURL(
  userId: string,
): Promise<string> {
  const bucketParams = {
    Bucket: IMAGE_BUCKET_NAME,
    Key: `${userId}/${Math.ceil(Math.random() * 10 ** 10)}`,
    ContentType: 'application/octet-stream',
    conditions: ['content-length-range', 0, 1000],
  };
  // Create the command.
  const command = new PutObjectCommand(bucketParams);

  // Create the presigned URL.
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return signedUrl;
}

export async function deleteAmazonS3Object() {
  const bucketParams = {
    Bucket: IMAGE_BUCKET_NAME,
    Key: `test-object-${Math.ceil(Math.random() * 10 ** 10)}`,
    Body: 'BODY',
    ContentType: 'application/octet-stream',
  };
  try {
    // Delete the object.
    console.log(`\nDeleting object "${bucketParams.Key}"} from bucket`);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketParams.Bucket,
        Key: bucketParams.Key,
      }),
    );
  } catch (err) {
    console.log('Error deleting object', err);
  }
}

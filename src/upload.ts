import { Readable } from "node:stream";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export interface UploadArgs {
  data: Readable;
  bucket: string;
  key: string;
  contentMD5: string;
  contentLength: number;
}

export async function upload(client: S3Client, args: UploadArgs) {
  const command = new PutObjectCommand({
    Bucket: args.bucket,
    Key: args.key,
    ContentMD5: args.contentMD5,
    ContentLength: args.contentLength,
    Body: args.data,
  });

  const result = await client.send(command);
  const etag = JSON.stringify(Buffer.from(args.contentMD5, "base64").toString("hex"));

  if (etag !== result.ETag) {
    throw new Error(`ETag mismatch. Expected ${etag} got ${result.ETag}`);
  }

  return result;
}

import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  S3Client,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";

export async function createBucket(client: S3Client, name: string) {
  const command = new CreateBucketCommand({
    Bucket: name,
  });

  await client.send(command);

  return name;
}

async function emptyBucket(client: S3Client, name: string) {
  const paginator = paginateListObjectsV2({ client }, { Bucket: name });
  for await (const page of paginator) {
    if (page.Contents) {
      await Promise.all(
        page.Contents.map(async (entry) => {
          const command = new DeleteObjectCommand({ Bucket: name, Key: entry.Key });
          await client.send(command);
        })
      );
    }
  }
}

export async function deleteBucket(client: S3Client, name: string) {
  await emptyBucket(client, name);

  const command = new DeleteBucketCommand({
    Bucket: name,
  });

  await client.send(command);

  return name;
}

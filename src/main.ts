import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { upload } from "./upload";
import { createClient } from "./client";
import { createBucket, deleteBucket } from "./create-bucket";

const client = createClient();
const count = parseInt(process.argv[2] ?? 100);
const size = 1000;
const bucket = `test-${randomUUID()}`;

try {
  console.log(`Start upload test with ${count} random files of ${size} bytes`);
  console.log(`Client endpoint`, await client.config.endpoint?.());

  await createBucket(client, bucket);
  console.log(`Created new bucket ${bucket}`);

  const start = Date.now();
  await Promise.all(
    Array.from({ length: count }).map(async (_) => {
      const key = randomUUID();
      const data = randomBytes(size);
      const md5 = createHash("md5").update(data).digest().toString("base64");

      await upload(client, {
        data: Readable.from(data),
        key,
        bucket,
        contentMD5: md5,
        contentLength: data.byteLength,
      });
    })
  );

  console.log(`Finished upload test in ${Date.now() - start}ms`);
} finally {
  await deleteBucket(client, bucket);
  console.log(`Cleaned up ${bucket}`);
}

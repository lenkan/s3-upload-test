import { fromIni } from "@aws-sdk/credential-providers";
import { S3Client } from "@aws-sdk/client-s3";

export function createClient(): S3Client {
  const endpoint = process.env.S3_ENDPOINT;

  if (endpoint) {
    console.log(`Using S3_ENDPOINT ${endpoint} to run tests`);
    return new S3Client({
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId: "admin", secretAccessKey: "password" },
    });
  }

  const profile = process.env.AWS_PROFILE;
  if (profile) {
    console.log(`Using AWS_PROFILE ${profile} to run tests`);
    return new S3Client({
      credentials: fromIni({ profile }),
    });
  }

  throw new Error(`No AWS_PROFILE or S3_ENDPOINT configured`);
}

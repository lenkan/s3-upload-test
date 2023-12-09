# Test script for uploading files concurrently to S3

## Run locally against minio

Start minio

```
docker compose up
```

Set S3_ENDPOINT to point to minio:

```
export S3_ENDPOINT=http://localhost:9000
```

Or,

```
source env.local.sh
```

Run test (tested on node v20)

```
npx tsx src/main.ts
```

## Run against AWS S3

Configure an aws profile, then set the env variable AWS_PROFILE.

```
export AWS_PROFILE=<your-profile-name>
```

Run test (tested on node v20)

```
npx tsx src/main.ts
```

## Increase count

```
npx tsx src/main.ts 10000
```

## Increase file sizes

Change the code.

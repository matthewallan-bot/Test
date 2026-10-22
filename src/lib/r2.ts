import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 (S3-compatible) client placeholders.
 * Audio and merch images should stream from public CDN URLs or short-lived
 * signed GETs — avoid proxying full files through Next.js route handlers.
 */
export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are required",
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function publicObjectUrl(storageKey: string): string {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("R2_PUBLIC_BASE_URL is not set");
  }
  return `${base}/${storageKey.replace(/^\//, "")}`;
}

/** Placeholder helper for private-bucket Range GETs (wire signing later). */
export async function getObjectMetadata(storageKey: string) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is not set");
  }
  return client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey,
    }),
  );
}

import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

export interface SiteBuckets {
  siteBucket: s3.Bucket;
  logsBucket: s3.Bucket;
}

export function createSiteBuckets(scope: Construct): SiteBuckets {
  const logsBucket = new s3.Bucket(scope, "LogsBucket", {
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    encryption: s3.BucketEncryption.S3_MANAGED,
    enforceSSL: true,
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    lifecycleRules: [{ expiration: Duration.days(90) }],
    removalPolicy: RemovalPolicy.RETAIN,
  });

  const siteBucket = new s3.Bucket(scope, "SiteBucket", {
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    encryption: s3.BucketEncryption.S3_MANAGED,
    enforceSSL: true,
    versioned: true,
    lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30) }],
    serverAccessLogsBucket: logsBucket,
    serverAccessLogsPrefix: "s3-access-logs/",
    removalPolicy: RemovalPolicy.RETAIN,
  });

  return { siteBucket, logsBucket };
}

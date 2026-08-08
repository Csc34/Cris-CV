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
    // CloudFront's classic access-logging feature (enableLogging/logBucket) still writes via
    // the legacy "awslogsdelivery" ACL grant, so this bucket must allow ACLs (BUCKET_OWNER_ENFORCED
    // rejects them). The bucket stays fully private — BlockPublicAccess is unrelated to this.
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
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

import * as path from "node:path";
import { Duration } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import type { Construct } from "constructs";

export interface SiteCdn {
  distribution: cloudfront.Distribution;
}

export function createCdn(
  scope: Construct,
  siteBucket: s3.Bucket,
  logsBucket: s3.Bucket,
  webAclArn: string,
): SiteCdn {
  const rewriteFn = new cloudfront.Function(scope, "UrlRewriteFunction", {
    code: cloudfront.FunctionCode.fromFile({
      filePath: path.join(__dirname, "..", "functions", "url-rewrite.js"),
    }),
    runtime: cloudfront.FunctionRuntime.JS_2_0,
  });

  const securityHeaders = new cloudfront.ResponseHeadersPolicy(scope, "SecurityHeadersPolicy", {
    securityHeadersBehavior: {
      contentSecurityPolicy: {
        contentSecurityPolicy:
          "default-src 'self'; img-src 'self' data:; font-src 'self' data:; " +
          "style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; " +
          "object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
        override: true,
      },
      contentTypeOptions: { override: true },
      frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
      referrerPolicy: {
        referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
        override: true,
      },
      strictTransportSecurity: {
        accessControlMaxAge: Duration.days(365),
        includeSubdomains: true,
        preload: true,
        override: true,
      },
    },
    customHeadersBehavior: {
      customHeaders: [
        {
          header: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
          override: true,
        },
      ],
    },
  });

  const distribution = new cloudfront.Distribution(scope, "SiteDistribution", {
    defaultRootObject: "index.html",
    defaultBehavior: {
      origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      responseHeadersPolicy: securityHeaders,
      functionAssociations: [
        { function: rewriteFn, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
      ],
      compress: true,
    },
    errorResponses: [
      { httpStatus: 403, responseHttpStatus: 404, responsePagePath: "/404.html", ttl: Duration.minutes(5) },
      { httpStatus: 404, responseHttpStatus: 404, responsePagePath: "/404.html", ttl: Duration.minutes(5) },
    ],
    webAclId: webAclArn,
    enableLogging: true,
    logBucket: logsBucket,
    logFilePrefix: "cloudfront-access-logs/",
    minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
  });

  return { distribution };
}

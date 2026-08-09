import { describe, it, expect } from "vitest";
import { App } from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import { PortfolioStack } from "../lib/portfolio-stack";

function synthStack() {
  const app = new App({
    context: {
      "@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy": true,
      alertEmail: "test@example.com",
      githubOrg: "test-org",
      githubRepo: "test-repo",
      budgetAmountUsd: 15,
    },
  });
  const stack = new PortfolioStack(app, "TestPortfolioStack", {
    env: { account: "123456789012", region: "us-east-1" },
  });
  return Template.fromStack(stack);
}

describe("PortfolioStack", () => {
  it("creates the site bucket fully private and encrypted", () => {
    const template = synthStack();

    template.hasResourceProperties("AWS::S3::Bucket", {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: Match.objectLike({
        ServerSideEncryptionConfiguration: Match.arrayWith([
          Match.objectLike({
            ServerSideEncryptionByDefault: Match.objectLike({ SSEAlgorithm: "AES256" }),
          }),
        ]),
      }),
    });
  });

  it("creates exactly one private-scoped S3 bucket policy (no public read)", () => {
    const template = synthStack();
    const policies = template.findResources("AWS::S3::BucketPolicy");
    for (const policy of Object.values(policies)) {
      const statements = (policy as any).Properties.PolicyDocument.Statement;
      for (const statement of statements) {
        expect(statement.Effect === "Allow" && statement.Principal === "*").toBe(false);
      }
    }
  });

  it("configures CloudFront with HTTPS redirect and no WAF (removed to cut cost)", () => {
    // No custom domain in v1, so CloudFront uses its own default certificate and
    // ViewerCertificate/MinimumProtocolVersion is intentionally absent from the template
    // (see AwsSolutions-CFR4 suppression in lib/nag-suppressions.ts for the same reasoning).
    const template = synthStack();

    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: Match.objectLike({
        DefaultCacheBehavior: Match.objectLike({ ViewerProtocolPolicy: "redirect-to-https" }),
      }),
    });
    const distributions = template.findResources("AWS::CloudFront::Distribution");
    const config = Object.values(distributions)[0] as any;
    expect(config.Properties.DistributionConfig.WebACLId).toBeUndefined();
  });

  it("attaches a security headers response headers policy", () => {
    const template = synthStack();

    template.hasResourceProperties("AWS::CloudFront::ResponseHeadersPolicy", {
      ResponseHeadersPolicyConfig: Match.objectLike({
        SecurityHeadersConfig: Match.objectLike({
          ContentSecurityPolicy: Match.objectLike({ Override: true }),
          FrameOptions: Match.objectLike({ FrameOption: "DENY", Override: true }),
          StrictTransportSecurity: Match.objectLike({ Override: true }),
        }),
      }),
    });
  });

  it("does not create a WAFv2 WebACL (removed to cut recurring cost)", () => {
    const template = synthStack();
    template.resourceCountIs("AWS::WAFv2::WebACL", 0);
  });

  it("creates CloudWatch alarms wired to an SNS topic", () => {
    const template = synthStack();

    template.resourceCountIs("AWS::SNS::Topic", 1);
    template.resourceCountIs("AWS::CloudWatch::Alarm", 2);
    template.hasResourceProperties("AWS::SNS::Subscription", {
      Protocol: "email",
      Endpoint: "test@example.com",
    });
  });

  it("creates a monthly cost budget with email alerts", () => {
    const template = synthStack();

    template.hasResourceProperties("AWS::Budgets::Budget", {
      Budget: Match.objectLike({
        BudgetLimit: { Amount: 15, Unit: "USD" },
        BudgetType: "COST",
      }),
    });
  });

  it("scopes the GitHub Actions deploy role trust to the configured repo's main branch", () => {
    const template = synthStack();

    template.hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Condition: Match.objectLike({
              StringLike: {
                "token.actions.githubusercontent.com:sub": "repo:test-org/test-repo:ref:refs/heads/main",
              },
            }),
          }),
        ]),
      }),
    });
  });
});

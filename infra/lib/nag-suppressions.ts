import { NagSuppressions } from "cdk-nag";
import type { Stack } from "aws-cdk-lib";

export function applyNagSuppressions(stack: Stack): void {
  NagSuppressions.addResourceSuppressionsByPath(
    stack,
    `${stack.stackName}/LogsBucket/Resource`,
    [
      {
        id: "AwsSolutions-S1",
        reason: "This is the access-logs bucket itself; it does not need to log to another bucket.",
      },
    ],
  );

  NagSuppressions.addResourceSuppressionsByPath(
    stack,
    `${stack.stackName}/SiteDistribution/Resource`,
    [
      {
        id: "AwsSolutions-CFR1",
        reason: "Public personal portfolio site with no audience restricted by geography.",
      },
      {
        id: "AwsSolutions-CFR4",
        reason:
          "v1 has no custom domain yet, so CloudFront's default certificate is used (TLS 1.2_2021 is still " +
          "enforced via minimumProtocolVersion for viewers that support SNI). Once a custom domain + ACM " +
          "certificate is added (see README v1.1 follow-up), this finding goes away on its own.",
      },
      {
        id: "AwsSolutions-CFR2",
        reason:
          "WAFv2 was deliberately removed to cut recurring cost (~$8/mo flat fee for a low-traffic personal " +
          "portfolio, independent of WAF actually blocking anything). Accepted trade-off: the site still sits " +
          "behind CloudFront (DDoS-resistant by design) with a private S3 origin, security response headers, " +
          "and HTTPS-only. Re-adding a WebACL later is a small, isolated change if traffic/risk grows.",
      },
    ],
  );

  NagSuppressions.addResourceSuppressionsByPath(
    stack,
    `${stack.stackName}/GithubActionsDeployRole/DefaultPolicy/Resource`,
    [
      {
        id: "AwsSolutions-IAM5",
        reason:
          "Object-level wildcard is required to sync/replace arbitrary static site files in the bucket, " +
          "and the CDK bootstrap role wildcard only matches this account's own cdk-hnb659fds-* bootstrap roles.",
      },
    ],
    true,
  );
}

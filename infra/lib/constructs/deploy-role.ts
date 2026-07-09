import { Duration, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import type { Construct } from "constructs";

const GITHUB_OIDC_URL = "https://token.actions.githubusercontent.com";

export interface DeployRoleProps {
  githubOrg: string;
  githubRepo: string;
  siteBucket: s3.Bucket;
  distribution: cloudfront.Distribution;
}

// NOTE: AWS allows only one OIDC provider per unique URL per account. If this account
// already has a GitHub Actions OIDC provider (e.g. from another project), replace this
// with `iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(...)` instead.
export function createDeployRole(scope: Construct, props: DeployRoleProps): iam.Role {
  const { githubOrg, githubRepo, siteBucket, distribution } = props;

  const oidcProvider = new iam.OpenIdConnectProvider(scope, "GithubOidcProvider", {
    url: GITHUB_OIDC_URL,
    clientIds: ["sts.amazonaws.com"],
  });

  const deployRole = new iam.Role(scope, "GithubActionsDeployRole", {
    assumedBy: new iam.WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
      StringEquals: { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      StringLike: {
        "token.actions.githubusercontent.com:sub": `repo:${githubOrg}/${githubRepo}:ref:refs/heads/main`,
      },
    }),
    maxSessionDuration: Duration.hours(1),
  });

  siteBucket.grantReadWrite(deployRole);

  deployRole.addToPolicy(
    new iam.PolicyStatement({
      actions: ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      resources: [
        `arn:aws:cloudfront::${Stack.of(scope).account}:distribution/${distribution.distributionId}`,
      ],
    }),
  );

  deployRole.addToPolicy(
    new iam.PolicyStatement({
      actions: ["sts:AssumeRole"],
      resources: [
        `arn:aws:iam::${Stack.of(scope).account}:role/cdk-hnb659fds-*-${Stack.of(scope).account}-us-east-1`,
      ],
    }),
  );

  return deployRole;
}

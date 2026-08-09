import { App, CfnOutput, Stack, type StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import { loadConfig } from "./config";
import { createSiteBuckets } from "./constructs/site-buckets";
import { createCdn } from "./constructs/cdn";
import { createMonitoring } from "./constructs/monitoring";
import { createCostBudget } from "./constructs/budget";
import { createDeployRole } from "./constructs/deploy-role";
import { applyNagSuppressions } from "./nag-suppressions";

export class PortfolioStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const config = loadConfig(this.node.root as App);

    const { siteBucket, logsBucket } = createSiteBuckets(this);
    const { distribution } = createCdn(this, siteBucket, logsBucket);
    createMonitoring(this, distribution, config.alertEmail);
    createCostBudget(this, config.alertEmail, config.budgetAmountUsd);
    const deployRole = createDeployRole(this, {
      githubOrg: config.githubOrg,
      githubRepo: config.githubRepo,
      siteBucket,
      distribution,
    });

    new CfnOutput(this, "BucketName", { value: siteBucket.bucketName });
    new CfnOutput(this, "DistributionId", { value: distribution.distributionId });
    new CfnOutput(this, "DistributionDomainName", { value: distribution.distributionDomainName });
    new CfnOutput(this, "DeployRoleArn", { value: deployRole.roleArn });

    applyNagSuppressions(this);
  }
}

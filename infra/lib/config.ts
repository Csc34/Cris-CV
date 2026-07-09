import type { App } from "aws-cdk-lib";

export interface PortfolioConfig {
  alertEmail: string;
  githubOrg: string;
  githubRepo: string;
  budgetAmountUsd: number;
}

export function loadConfig(app: App): PortfolioConfig {
  const alertEmail = app.node.tryGetContext("alertEmail");
  const githubOrg = app.node.tryGetContext("githubOrg");
  const githubRepo = app.node.tryGetContext("githubRepo");
  const budgetAmountUsd = app.node.tryGetContext("budgetAmountUsd");

  if (!alertEmail) {
    throw new Error("Missing required CDK context value: alertEmail (set it in infra/cdk.json)");
  }

  return {
    alertEmail,
    githubOrg: githubOrg ?? "REPLACE_ME",
    githubRepo: githubRepo ?? "REPLACE_ME",
    budgetAmountUsd: Number(budgetAmountUsd ?? 15),
  };
}

#!/usr/bin/env node
import "source-map-support/register";
import { App, Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { PortfolioStack } from "../lib/portfolio-stack";

const app = new App();

new PortfolioStack(app, "PortfolioStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

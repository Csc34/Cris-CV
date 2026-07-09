import { describe, it, expect } from "vitest";
import { App, Aspects } from "aws-cdk-lib";
import { Annotations, Match } from "aws-cdk-lib/assertions";
import { AwsSolutionsChecks } from "cdk-nag";
import { PortfolioStack } from "../lib/portfolio-stack";

describe("cdk-nag AwsSolutions checks", () => {
  it("reports no unsuppressed errors", () => {
    const app = new App({
      context: {
        "@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy": true,
        alertEmail: "test@example.com",
        githubOrg: "test-org",
        githubRepo: "test-repo",
        budgetAmountUsd: 15,
      },
    });
    const stack = new PortfolioStack(app, "NagTestPortfolioStack", {
      env: { account: "123456789012", region: "us-east-1" },
    });

    Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
    app.synth();

    const errors = Annotations.fromStack(stack).findError(
      "*",
      Match.stringLikeRegexp("AwsSolutions-.*"),
    );

    if (errors.length > 0) {
      // eslint-disable-next-line no-console
      console.error(errors.map((e) => `${e.id}: ${JSON.stringify(e.entry.data)}`).join("\n"));
    }

    expect(errors).toHaveLength(0);
  });
});

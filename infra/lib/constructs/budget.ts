import * as budgets from "aws-cdk-lib/aws-budgets";
import type { Construct } from "constructs";

export function createCostBudget(scope: Construct, alertEmail: string, amountUsd: number): void {
  new budgets.CfnBudget(scope, "MonthlyCostBudget", {
    budget: {
      budgetType: "COST",
      timeUnit: "MONTHLY",
      budgetLimit: { amount: amountUsd, unit: "USD" },
    },
    notificationsWithSubscribers: [
      {
        notification: {
          notificationType: "ACTUAL",
          comparisonOperator: "GREATER_THAN",
          threshold: 80,
          thresholdType: "PERCENTAGE",
        },
        subscribers: [{ subscriptionType: "EMAIL", address: alertEmail }],
      },
      {
        notification: {
          notificationType: "FORECASTED",
          comparisonOperator: "GREATER_THAN",
          threshold: 100,
          thresholdType: "PERCENTAGE",
        },
        subscribers: [{ subscriptionType: "EMAIL", address: alertEmail }],
      },
    ],
  });
}

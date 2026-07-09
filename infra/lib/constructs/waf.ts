import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import type { Construct } from "constructs";

export function createWebAcl(scope: Construct): wafv2.CfnWebACL {
  return new wafv2.CfnWebACL(scope, "WebAcl", {
    defaultAction: { allow: {} },
    scope: "CLOUDFRONT",
    visibilityConfig: {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: "portfolioWebAcl",
    },
    rules: [
      {
        name: "AWS-AWSManagedRulesCommonRuleSet",
        priority: 0,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: { vendorName: "AWS", name: "AWSManagedRulesCommonRuleSet" },
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "commonRuleSet",
        },
      },
      {
        name: "AWS-AWSManagedRulesKnownBadInputsRuleSet",
        priority: 1,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesKnownBadInputsRuleSet",
          },
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "knownBadInputs",
        },
      },
      {
        name: "RateLimitPerIp",
        priority: 2,
        action: { block: {} },
        statement: {
          rateBasedStatement: { limit: 2000, aggregateKeyType: "IP" },
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "rateLimit",
        },
      },
    ],
  });
}

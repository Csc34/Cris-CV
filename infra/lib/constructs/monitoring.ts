import { Duration } from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cwActions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import type { Construct } from "constructs";

export function createMonitoring(
  scope: Construct,
  distribution: cloudfront.Distribution,
  alertEmail: string,
): sns.Topic {
  const alertTopic = new sns.Topic(scope, "AlertsTopic", { enforceSSL: true });
  alertTopic.addSubscription(new subscriptions.EmailSubscription(alertEmail));

  const dims = { DistributionId: distribution.distributionId, Region: "Global" };

  const dashboard = new cloudwatch.Dashboard(scope, "SiteDashboard", {
    dashboardName: "portfolio-site",
  });

  dashboard.addWidgets(
    new cloudwatch.GraphWidget({
      title: "Requests",
      left: [
        new cloudwatch.Metric({
          namespace: "AWS/CloudFront",
          metricName: "Requests",
          dimensionsMap: dims,
          statistic: "Sum",
        }),
      ],
    }),
    new cloudwatch.GraphWidget({
      title: "Error rates",
      left: [
        new cloudwatch.Metric({
          namespace: "AWS/CloudFront",
          metricName: "4xxErrorRate",
          dimensionsMap: dims,
          statistic: "Average",
        }),
        new cloudwatch.Metric({
          namespace: "AWS/CloudFront",
          metricName: "5xxErrorRate",
          dimensionsMap: dims,
          statistic: "Average",
        }),
      ],
    }),
    new cloudwatch.GraphWidget({
      title: "Bytes downloaded",
      left: [
        new cloudwatch.Metric({
          namespace: "AWS/CloudFront",
          metricName: "BytesDownloaded",
          dimensionsMap: dims,
          statistic: "Sum",
        }),
      ],
    }),
  );

  const fiveXxAlarm = new cloudwatch.Alarm(scope, "FiveXxAlarm", {
    metric: new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "5xxErrorRate",
      dimensionsMap: dims,
      statistic: "Average",
      period: Duration.minutes(5),
    }),
    threshold: 5,
    evaluationPeriods: 3,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
  });
  fiveXxAlarm.addAlarmAction(new cwActions.SnsAction(alertTopic));

  const fourXxAlarm = new cloudwatch.Alarm(scope, "FourXxAlarm", {
    metric: new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "4xxErrorRate",
      dimensionsMap: dims,
      statistic: "Average",
      period: Duration.minutes(5),
    }),
    threshold: 10,
    evaluationPeriods: 3,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
  });
  fourXxAlarm.addAlarmAction(new cwActions.SnsAction(alertTopic));

  return alertTopic;
}

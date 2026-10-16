import { getApiAnalytics } from "../repositories/analyticsRepository.js";

export async function getAnalytics(req, res) {
  try {
    const { apiId } = req.params;

    const analytics = await getApiAnalytics(
  apiId,
  req.user.id
);

    const totalRequests =
      Number(analytics.total_requests);

    const successfulRequests =
      Number(analytics.successful_requests);

    const failedRequests =
      Number(analytics.failed_requests);

    const errorRate =
      totalRequests === 0
        ? 0
        : (failedRequests / totalRequests) * 100;

    return res.status(200).json({
      success: true,
      analytics: {
        totalRequests,
        successfulRequests,
        failedRequests,
        errorRate: Number(errorRate.toFixed(2)),
        averageResponseTime:
          Number(analytics.average_response_time) || 0,
        minResponseTime:
          Number(analytics.min_response_time) || 0,
        maxResponseTime:
          Number(analytics.max_response_time) || 0,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
}
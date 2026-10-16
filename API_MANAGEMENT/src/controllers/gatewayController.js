import axios from "axios";

import {
  createMetric,
} from "../repositories/metricRepository.js";


export async function gatewayHandler(req, res) {
  try {

    const startTime = Date.now();

    const { endpoint } = req.params;

    const api = req.api;

    if (!api) {
      return res.status(404).json({
        message: "API not found",
      });
    }

    const targetUrl =
      `${api.base_url}/${endpoint}`;

    console.log(
      "Forwarding to:",
      targetUrl
    );


    // Headers to forward
    const forwardedHeaders = {};


    if (req.headers["content-type"]) {
      forwardedHeaders["content-type"] =
        req.headers["content-type"];
    }


    if (req.headers["authorization"]) {
      forwardedHeaders["authorization"] =
        req.headers["authorization"];
    }


    if (req.headers["accept"]) {
      forwardedHeaders["accept"] =
        req.headers["accept"];
    }


    // Forward request to backend
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: forwardedHeaders,
      params: req.query,
      data: req.body,
      timeout: 5000,
    });


    // Calculate response time
    const responseTimeMs =
      Date.now() - startTime;


    // Store successful request metric
    await createMetric({
      apiId: req.api.id,
      apiKeyId: req.apiKey.id,
      statusCode: response.status,
      responseTimeMs,
    });


    // Return backend response
    return res
      .status(response.status)
      .json(response.data);


  } catch (error) {

    console.error(error);


    // Backend returned an HTTP error
    if (error.response) {

      const responseTimeMs =
        Date.now() - startTime;


      // Store failed request metric
      await createMetric({
        apiId: req.api.id,
        apiKeyId: req.apiKey.id,
        statusCode: error.response.status,
        responseTimeMs,
      });


      return res
        .status(error.response.status)
        .json(error.response.data);
    }


    // No response from backend
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
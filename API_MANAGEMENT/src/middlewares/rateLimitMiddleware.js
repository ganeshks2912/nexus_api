import redisClient
  from "../config/redis.js";

export async function rateLimitMiddleware(
  req,
  res,
  next
) {
  try {

    const LIMIT = req.api.rate_limit;
    const WINDOW_SIZE = req.api.rate_limit_window;
   
    const apiKeyId =
      req.apiKey.id;

    const redisKey =
       `rate_limit:${apiKeyId}:${req.api.id}`;

    const now =
      Date.now();

    const windowStart =
      now - WINDOW_SIZE * 1000;

    await redisClient.zRemRangeByScore(
        redisKey,
         0,
         windowStart
      );

    const requestCount =
        await redisClient.zCard(
            redisKey
        );
        console.log(
                "Request Count:",
             requestCount
                );

    if (requestCount >= LIMIT) {
       return res.status(429).json({
         success: false,
         message: "Rate limit exceeded"
       });
     }

     await redisClient.zAdd(
       redisKey,
      [
        {
         score: now,
         value: now.toString()
         }
      ]
     );

     await redisClient.expire(
       redisKey,
        WINDOW_SIZE
         );
      
    return next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
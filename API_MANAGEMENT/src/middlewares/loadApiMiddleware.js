import {
  findApiById
} from "../repositories/apiRepository.js";

export async function loadApiMiddleware(
  req,
  res,
  next
) {
  try {
    const { apiId } = req.params;

    const api =
      await findApiById(apiId);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found"
      });
    }

    req.api = api;

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
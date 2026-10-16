// Server entry point
import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";
import redisClient from "./config/redis.js";

dotenv.config();

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
      console.log("Database connected!");

    await redisClient.connect();
      console.log("Redis connected!");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:");
    console.error(error.message);
  }
};

startServer();
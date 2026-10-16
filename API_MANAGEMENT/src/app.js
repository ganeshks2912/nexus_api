// Express app configuration
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import apiKeyRoutes
  from "./routes/apiKeyRoutes.js";
import gatewayRoutes
  from "./routes/gatewayRoutes.js";
import analyticsRoutes
  from "./routes/analyticsRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tenants", tenantRoutes);
app.use(
  "/apis",
  apiRoutes
);
app.use(
  "/api-keys",
  apiKeyRoutes
);
app.use(
  "/gateway",
  gatewayRoutes
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
  });
});

app.use(
  "/analytics",
  analyticsRoutes
);


export default app;
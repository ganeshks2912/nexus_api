import express from "express";

const app = express();

app.use(express.json());

app.get("/orders", (req, res) => {
  res.json({
    success: true,
    service: "payment-service",
    endpoint: "orders",
    data: [
      {
        id: 1,
        amount: 100
      },
      {
        id: 2,
        amount: 250
      }
    ]
  });
});
app.post("/orders", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Order created",
    receivedData: req.body,
  });
});

app.get("/products", (req, res) => {
  res.json({
    success: true,
    query: req.query,
  });
});

app.get("/headers", (req, res) => {
  res.json({
    headers: req.headers,
  });
});
app.listen(6000, () => {
  console.log(
    "Mock service running on port 6000"
  );
});
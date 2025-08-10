import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8002;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Heartly Backend is running!",
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Simple API endpoints for testing
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.post("/api/echo", (req, res) => {
  res.json({ 
    message: "Echo endpoint", 
    received: req.body 
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Simple Heartly Backend running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`📍 API test: http://localhost:${port}/api/test`);
});
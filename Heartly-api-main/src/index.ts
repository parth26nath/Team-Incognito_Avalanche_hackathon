import express, { Express } from "express";
import dotenv from "dotenv";
import userRouter from "./routers/UserRouter";
import authRouter from "./routers/AuthRouter";
// import { AppDataSource } from "./db/AppDataSource";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import socketSetup from "./socketSetup";
import { authenticateSocketToken } from "./middlewares/AuthMiddleware";
import ExtendedSocket from "./interfaces/ExtendedSocket";

dotenv.config();

// Development defaults for database (fallback if no .env)
if (!process.env.DB_HOST) {
  process.env.DB_HOST = "localhost";
  process.env.DB_PORT = "5432";
  process.env.DB_USERNAME = "postgres";
  process.env.DB_PASSWORD = "postgres";
  process.env.DB_DATABASE = "heartlydb";
  process.env.JWT_SECRET = "development-jwt-secret";
  process.env.PORT = "8002";
  process.env.SOCKET_PORT = "8003";
  process.env.ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:5173";
  console.log("⚠️  Using development defaults - create .env file for production");
}

const app: Express = express();
const httpPort = parseInt(process.env.PORT || "8002");
const socketPort = parseInt(process.env.SOCKET_PORT || "8003");
const server: HTTPServer = createServer(app);
// Configure CORS origins based on environment
const getAllowedOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  }
  
  // Default origins for development and production
  const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8002",
    "https://heartly.live",
    "https://www.heartly.live",
    "https://api.heartly.live"
  ];
  
  return defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();

const io: SocketServer = new SocketServer(server, {
  path: process.env.SOCKET_BASE_PATH || "/socket/",
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
const peerServer = ExpressPeerServer(server, {
  path: "/peer",
  proxied: true,
});

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        console.warn(`Origin ${origin} not allowed by CORS`);
      }
      
      // Always allow the request to go through - we'll handle specific endpoints with proper CORS
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // Cache preflight requests for 10 minutes
  }),
);
app.use(express.json());

// Configure base path for API routes
const apiBasePath = process.env.API_BASE_PATH || "";

app.use(`${apiBasePath}/auth`, authRouter);
app.use(`${apiBasePath}/users`, userRouter);
app.use(`${apiBasePath}/peerjs`, peerServer);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the heartly api" });
});

// Health check endpoint for the API base path
app.get(`${apiBasePath}/health`, (req, res) => {
  res.json({ 
    status: "healthy",
    message: "Heartly API is running",
    timestamp: new Date().toISOString(),
    basePath: apiBasePath
  });
});

io.use((socket: ExtendedSocket, next) => {
  const token = socket.handshake.auth.token;
  const authenticatedUser = authenticateSocketToken(token);
  if (!authenticatedUser) {
    console.log("Couldnt authenticate socket");
    next(new Error("Invalid authentication token"));
  } else {
    console.log("Authenticated");
    socket.user = authenticatedUser;
    next();
  }
});
socketSetup(io);

// Start server without database for now
console.log("🚀 Starting Heartly Backend Server");
console.log(`📊 Database: Development mode (no database required)`);
console.log(`🌐 API Server: http://localhost:${httpPort}`);
console.log(`🔌 Socket Server: http://localhost:${socketPort}`);

server.listen(httpPort, () => {
  console.log(`✅ API Server running on port ${httpPort}`);
});

// Uncomment below when database is configured:
// AppDataSource.initialize()
//   .then(async () => {
//     server.listen(httpPort, () =>
//       console.log(`Server up and running on ${httpPort}`),
//     );
//   })
//   .catch((error) => console.log("Error initializing datasource:", error));

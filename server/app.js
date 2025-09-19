// import express, { json } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./config/connectdb.js";
// import passport from "passport";
// // routes
// import userRoutes from "./routes/userRoutes.js";
// import agentRoutes from "./routes/agentRoutes.js";
// import willDeedRoutes from "./routes/willDeedRoutes.js";
// import saleDeedRoutes from "./routes/saleDeedRoutes.js";
// import trustDeedRoutes from "./routes/trustDeedRoutes.js";
// import propertyRegistrationRoutes from "./routes/propertyRegistrationRoutes.js";
// import propertySaleCertificateRoutes from "./routes/propertySaleCertificateRoutes.js";
// import dotenv from "dotenv"; 
// import './config/passport-jwt-strategy.js'
// dotenv.config()

// const app = express();

// const port = process.env.PORT || 4001;
// const DATABASE_URL = process.env.DATABASE_URL;

// // cors policy
// const allowedOrigin = process.env.FRONTEND_HOST || 'http://localhost:3000';
// app.use(cors({
//   origin: allowedOrigin,
//   credentials: true,
// }));

// // database connection 
// connectDB(DATABASE_URL);

// // JSON
// app.use(express.json());

// // Passport Middleware
// app.use(passport.initialize());

// // cookieParser 
// app.use(cookieParser());

// // Load Routes
// app.use("/api/user", userRoutes);
// app.use("/api/agent", agentRoutes);
// app.use("/api/will-deed", willDeedRoutes);
// app.use("/api/sale-deed", saleDeedRoutes);
// app.use("/api/trust-deed", trustDeedRoutes);
// app.use("/api/property-registration", propertyRegistrationRoutes);
// app.use("/api/property-sale-certificate", propertySaleCertificateRoutes);

// // Static for uploads
// import path from "path";
// import fs from "fs";
// const uploadsPath = path.join(process.cwd(), "uploads");
// if(!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
// app.use("/uploads", express.static(uploadsPath));



// // app.use("/api", userRoutes);

// app.listen(port, () => {
//   console.log(`Server is running ${port}`);
// })

import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/connectdb.js";
import passport from "passport";
import logger from "./config/logger.js";
import { generalLimiter } from "./config/rateLimits.js";
// routes
import userRoutes from "./routes/userRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import willDeedRoutes from "./routes/willDeedRoutes.js";
import saleDeedRoutes from "./routes/saleDeedRoutes.js";
import trustDeedRoutes from "./routes/trustDeedRoutes.js";
import propertyRegistrationRoutes from "./routes/propertyRegistrationRoutes.js";
import propertySaleCertificateRoutes from "./routes/propertySaleCertificateRoutes.js";
import powerOfAttorneyRoutes from "./routes/powerOfAttorneyRoutes.js";
import adoptionDeedRoutes from "./routes/adoptionDeedRoutes.js";
import dotenv from "dotenv";
import './config/passport-jwt-strategy.js'
dotenv.config()

const app = express();

const port = process.env.PORT || 4001;
const DATABASE_URL = process.env.DATABASE_URL;

// Security middleware - Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for file uploads
}));

// CORS policy
const allowedOrigin = process.env.FRONTEND_HOST || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Rate limiting
app.use(generalLimiter);

// Database connection 
connectDB(DATABASE_URL);

// JSON - Increased limit for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport Middleware
app.use(passport.initialize());

// Cookie parser 
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Load Routes
app.use("/api/user", userRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/will-deed", willDeedRoutes);
app.use("/api/sale-deed", saleDeedRoutes);
app.use("/api/trust-deed", trustDeedRoutes);
app.use("/api/property-registration", propertyRegistrationRoutes);
app.use("/api/property-sale-certificate", propertySaleCertificateRoutes);
app.use("/api/power-of-attorney", powerOfAttorneyRoutes);
app.use("/api/adoption-deed", adoptionDeedRoutes);

// Static for uploads
import path from "path";
import fs from "fs";
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  // Log error with Winston
  logger.error(`Global Error Handler: ${error.message}`, {
    error: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'fail',
        message: 'Unexpected file field.'
      });
    }
  }

  res.status(500).json({
    status: 'error',
    message: error.message || 'Internal server error'
  });
});

// Handle 404 for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'API endpoint not found'
  });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend host: ${allowedOrigin}`);
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend host: ${allowedOrigin}`);
});
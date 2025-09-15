import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectdb.js";
import passport from "passport";
// routes
import userRoutes from "./routes/userRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import willDeedRoutes from "./routes/willDeedRoutes.js";
import saleDeedRoutes from "./routes/saleDeedRoutes.js";
import trustDeedRoutes from "./routes/trustDeedRoutes.js";
import propertyRegistrationRoutes from "./routes/propertyRegistrationRoutes.js";
import propertySaleCertificateRoutes from "./routes/propertySaleCertificateRoutes.js";
import dotenv from "dotenv"; 
import './config/passport-jwt-strategy.js'
dotenv.config()

const app = express();

const port = process.env.PORT || 4001;
const DATABASE_URL = process.env.DATABASE_URL;

// cors policy
const allowedOrigin = process.env.FRONTEND_HOST || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// database connection 
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());

// cookieParser 
app.use(cookieParser());

// Load Routes
app.use("/api/user", userRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/will-deed", willDeedRoutes);
app.use("/api/sale-deed", saleDeedRoutes);
app.use("/api/trust-deed", trustDeedRoutes);
app.use("/api/property-registration", propertyRegistrationRoutes);
app.use("/api/property-sale-certificate", propertySaleCertificateRoutes);

// Static for uploads
import path from "path";
import fs from "fs";
const uploadsPath = path.join(process.cwd(), "uploads");
if(!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));



// app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running ${port}`);
})
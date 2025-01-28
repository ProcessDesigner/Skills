import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({
  origin: ["http://localhost:5173", "https://leetcode.com"],
  credentials: true,  // Allow credentials like cookies or authorization headers
}));

app.use(express.json()); // allows us to parse incoming request
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Port is running at ${PORT}`);
});
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./database.js";
import authRouter from "./src/routes/auth.js";

dotenv.config();
const conStr = process.env.DATABASE;

connectDatabase(conStr);
const app = express();
const port = 3000;

// CORS Middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth/", authRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.js";
import transactionRouter from "./routes/transaction.js";
import graphRouter from "./routes/graph.js";
import accountRouter from "./routes/account.js";
import cronRoutes from "./routes/cron.js";
import { requireAuth } from "./middlewares/auth.js";

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

const frontendDomain = process.env.FRONTEND_DOMAIN || "http://localhost:5173";
if (!process.env.FRONTEND_DOMAIN) {
  console.warn(
    "FRONTEND_DOMAIN is not set. Defaulting CORS origin to http://localhost:5173"
  );
}

app.use(
  cors({
    origin: frontendDomain,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

// Sample Route
app.get("/", (req, res) => {
  res.send("Prisma with Express is running! 🚀");
});

// Auth routes (public)
app.use("/auth", authRouter);

// Protected routes
app.use("/accounts", requireAuth, accountRouter);
app.use("/transactions", requireAuth, transactionRouter);
app.use("/graphs", requireAuth, graphRouter);
app.use("/cron", cronRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

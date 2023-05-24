/*Imports*/
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
/* Routes Imports*/
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transaction.js";
import investmentsRoutes from "./routes/investments.js";
import ticketRoutes from "./routes/ticket.js";
import adminRoutes from "./routes/admin.js";
import walletRoutes from "./routes/wallet.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/*ROUTES*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/investments", investmentsRoutes);
app.use("/tickets", ticketRoutes);
app.use("/wallet", walletRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));

    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

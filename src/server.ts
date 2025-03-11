import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import invoiceRoutes from "./routes/invoice.route";
import customerRoutes from "./routes/customer.route";
import vehicleRoutes from "./routes/vehicle.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/invoice", invoiceRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/vehicle", vehicleRoutes);

app.get("/", (req, res) => {
  res.send("Car Repair CRM API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

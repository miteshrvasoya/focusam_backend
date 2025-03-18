import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    registration: { type: String, unique: true, sparse: true }, // Unique but allows multiple null values
    vin: { type: String, unique: true, sparse: true }, // Unique only if provided, prevents duplicate null
    color: { type: String },
    odometer: { type: Number },
    status: { type: String, enum: ["active", "maintenance", "inactive"], default: "active" },
    notes: { type: String },
  },
  { timestamps: true }
);


export default mongoose.model("Vehicle", VehicleSchema);

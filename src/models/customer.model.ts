import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from "nanoid"; // Generates unique IDs

export interface ICustomer extends Document {
  id: string; // Custom generated ID
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    id: { type: String, unique: true }, // Custom ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String},
    notes: { type: String },
  },
  { timestamps: true }
);

// Generate custom ID before saving a new customer
CustomerSchema.pre<ICustomer>("save", function (next) {
  if (!this.id) {
    this.id = `CUS-${nanoid(8).toUpperCase()}`; // Example: CUS-ABCDEFGH
  }
  next();
});

const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;

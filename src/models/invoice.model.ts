import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from "nanoid";

export interface IInvoice extends Document {
  id: string; // Custom generated ID
  customerId: string;
  vehicleId: string;
  date: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  paymentMethod: string;
  notes?: string;
  amount: number;
  services: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    id: { type: String, unique: true }, // Custom ID
    invoiceNumber: { type: String, unique: true, required: true },
    customerId: { type: String, required: true },
    vehicleId: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["paid", "pending", "overdue"], required: true },
    paymentMethod: { type: String, required: true },
    notes: { type: String },
    amount: { type: Number, required: true }, 
    services: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Generate custom ID before saving a new invoice
InvoiceSchema.pre<IInvoice>("save", function (next) {
  if (!this.id) {
    this.id = `INV-${nanoid(8).toUpperCase()}`; // Example: INV-ABCDEFGH
  }
  next();
});

const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;

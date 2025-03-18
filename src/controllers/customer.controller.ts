import { Request, Response } from "express";
import Customer from "../models/customer.model";
import Invoice from "../models/invoice.model";

export const createCustomer = async (req: Request, res: Response) => {
    try {

        console.log("Creating the Customer");
        const { name, email, phone } = req.body;

        if (!name || !email || !phone ) {
            res.status(400).json({ success: false, message: "All fields except notes are required" });
            return;
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
        if (existingCustomer) {
            res.status(400).json({ success: false, message: "Customer with this email or phone already exists" });

            return;
        }

        const customer = new Customer({ name, email, phone });
        await customer.save();

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
        return;
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
};


export const getCustomers = async (req: Request, res: Response) => {
    try {
        // Fetch customers
        const customers = await Customer.find().sort({ createdAt: -1 });

        // Fetch all invoices related to the customers
        const customerIds = customers.map(customer => customer._id);
        const invoices = await Invoice.find({ customerId: { $in: customerIds } });

        // Calculate total spent for each customer
        const customerTotalSpentMap = invoices.reduce((acc, invoice) => {
            acc[invoice.customerId] = (acc[invoice.customerId] || 0) + invoice.amount;
            return acc;
        }, {} as Record<string, number>);

        res.status(200).json({
            success: true,
            data: customers.map((customer: any) => ({
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                lastVisit: new Date().toISOString(), // Placeholder, replace with actual visit logic
                totalSpent: customerTotalSpentMap[customer._id.toString()] || 0, // Get total spent
                invoices: invoices.filter((inv: any) => inv.customerId.toString() === customer._id.toString()), // Get related invoices
                notes: customer.notes,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getCustomersFromMobile = async (req: Request, res: Response) => {
    try {
        let phone = req.params.mo_no;

        console.log("Search String: ", phone);
        // Check if customer already exists
        const customer :any= await Customer.findOne({
            phone: phone, // Matches phone number anywhere in the string
          });
          

        console.log("Customer Details:", customer);
        
        if(customer && Object.keys(customer).length) {
            res.status(200).json({
                success: true,
                data: {
                    id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    lastVisit: new Date().toISOString(), // Placeholder, replace with actual visit logic
                    totalSpent: 0, // Placeholder, replace with actual total spent logic
                    invoices: [], // Placeholder, replace with actual invoices linked to the customer
                    notes: customer.notes,
                    createdAt: customer.createdAt,
                    updatedAt: customer.updatedAt,
                },
            });
            return;
        } else {
            res.status(200).json({
                success: true,
                data: {},
            });
            return;
        }

        
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
};

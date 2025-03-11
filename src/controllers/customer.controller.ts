import { Request, Response } from "express";
import Customer from "../models/customer.model";

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, notes } = req.body;

        if (!name || !email || !phone || !address) {
            res.status(400).json({ success: false, message: "All fields except notes are required" });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
        if (existingCustomer) {
            res.status(400).json({ success: false, message: "Customer with this email or phone already exists" });
        }

        const customer = new Customer({ name, email, phone, address, notes });
        await customer.save();

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: customers.map((customer) => ({
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
        } else {
            res.status(200).json({
                success: true,
                data: {},
            });
        }

        
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

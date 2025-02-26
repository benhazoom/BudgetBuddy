"use client";

import React, { useState } from "react";
import { TextField, MenuItem, Button, Box } from "@mui/material";
import { useUser } from "@clerk/nextjs";

export default function CreateInvoice() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");

    const { user } = useUser(); // Get Clerk user info

    const [categories, setCategories] = useState<string[]>([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch("/api/budget");
            if (response.ok) {
                const data = await response.json();
                setCategories(data.map((budget: { category: string }) => budget.category));
            } else {
                alert("Failed to fetch categories");
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!user) {
            alert("You must be logged in to create an invoice");
            return;
        }

        const response = await fetch("/api/invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, category, amount }),
        });

        if (response.ok) {
            alert("Invoice created successfully");
            setName("");
            setCategory("");
            setAmount("");
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Button type="submit" variant="contained" color="primary">
                Create Invoice
            </Button>
        </Box>
    );
}

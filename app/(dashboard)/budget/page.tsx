"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation"; // Import the useRouter hook

interface Invoice {
    _id: string;
    name: string;
    category: string;
    amount: number;
}

interface Budget {
    category: string;
    amount: number;
}

export default function BudgetPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [categorySums, setCategorySums] = useState<Record<string, number>>({});
    const [saving, setSaving] = useState(false);
    const router = useRouter(); // Initialize the router

    // Categories we're working with (removed "Income")
    const categories = ['Food', 'Clothing', 'Bills'];

    // Fetch invoices
    useEffect(() => {
        async function fetchInvoicesAndBudgets() {
            try {
                const [invoicesRes, budgetsRes] = await Promise.all([
                    fetch("/api/invoices"),
                    fetch("/api/budget")
                ]);

                if (!invoicesRes.ok) throw new Error("Failed to fetch invoices");
                if (!budgetsRes.ok) throw new Error("Failed to fetch budgets");

                const invoicesData = await invoicesRes.json();
                const budgetsData = await budgetsRes.json();

                setInvoices(invoicesData);
                setBudgets(budgetsData);
            } catch (error) {
                console.error("Error fetching invoices and budgets:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInvoicesAndBudgets();

    }, []);

    // Sum up the invoices by category
    useEffect(() => {
        const sums: Record<string, number> = {};
        invoices.forEach((invoice) => {
            sums[invoice.category] = (sums[invoice.category] || 0) + invoice.amount;
        });
        setCategorySums(sums);
    }, [invoices]);

    // Handle budget change
    const handleBudgetChange = (category: string, amount: number) => {
        setBudgets((prev) => {
            const existing = prev.find((b) => b.category === category);
            if (existing) {
                existing.amount = amount;
            } else {
                prev.push({ category, amount });
            }
            return [...prev];
        });
    };

    // Save budgets to the database and redirect to the dashboard
    const saveBudgets = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/budget", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(budgets),
            });

            if (!res.ok) {
                throw new Error("Failed to save budgets");
            }
            alert("Budgets saved successfully");

            // Redirect to the dashboard after saving
            router.push("/"); // Redirect to the dashboard

        } catch (error) {
            console.error("Error saving budgets:", error);
            alert("Error saving budgets");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Set Your Budgets
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                categories.map((category) => (
                    <Box key={category} sx={{ marginBottom: 3 }}>
                        <Typography variant="h6">{category}</Typography>
                        <TextField
                            label="Budget"
                            type="number"
                            value={budgets.find((b) => b.category === category)?.amount || ""}
                            onChange={(e) =>
                                handleBudgetChange(category, parseFloat(e.target.value) || 0)
                            }
                            fullWidth
                        />
                        <Typography>
                            Sum: {categorySums[category] || 0} / Budget: {budgets.find((b) => b.category === category)?.amount || 0}
                        </Typography>
                        <Typography>
                            Ratio:{" "}
                            {budgets.find((b) => b.category === category)?.amount
                                ? (
                                    (categorySums[category] || 0) /
                                    (budgets.find((b) => b.category === category)?.amount || 1)
                                ).toFixed(2)
                                : "N/A"}
                        </Typography>
                    </Box>
                ))
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={saveBudgets}
                disabled={saving}
            >
                {saving ? "Saving..." : "Save Budgets"}
            </Button>
        </Box>
    );
}

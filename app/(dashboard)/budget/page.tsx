"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
    const [categories, setCategories] = useState<string[]>(['Food', 'Clothing', 'Bills']);
    const [categorySums, setCategorySums] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const router = useRouter();
    //adding new budgeting category
    const [addingCategory, setAddingCategory] = useState<boolean>(false);
    const [postingCategoryTodb, setPostingCategoryTodb] = useState<boolean>(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState(0);

    // Fetch invoices and budgets
    useEffect(() => {
        async function fetchData() {
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

                // Add any categories from budgets that are missing in state
                const fetchedCategories = budgetsData.map((b: Budget) => b.category);
                setCategories((prev) => [...new Set([...prev, ...fetchedCategories])]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Calculate total spent per category
    useEffect(() => {
        const sums: Record<string, number> = {};
        invoices.forEach((invoice) => {
            sums[invoice.category] = (sums[invoice.category] || 0) + Number(invoice.amount);
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

    // Save budgets to the database
    const saveBudgets = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(budgets),
            });

            if (!res.ok) throw new Error("Failed to save budgets");
            toast.success("Budgets saved successfully");

            router.push("/");
        } catch (error) {
            console.error("Error saving budgets:", error);
            toast.error("Error saving budgets");
        } finally {
            setSaving(false);
        }
    };

    // Function to submit the added category
    const addCategory = async () => {
        setPostingCategoryTodb(true);
        if (!name.trim()) return toast.error("Category name cannot be empty");
        if (categories.includes(name)) return toast.error("Category already exists");

        try {
            const res = await fetch("/api/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: name, amount: budget }),
            });

            if (!res.ok) throw new Error("Failed to add category");

            // Update the UI
            setCategories((prev) => [...prev, name]);
            setBudgets((prev) => [...prev, { category: name, amount: budget }]);
            toast.success("Category added successfully!");
            setAddingCategory(false);
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Error adding category");
        }
        finally {
            setSaving(false);
            setPostingCategoryTodb(false);

        }
    };

    // Function to delete category
    const handleDelete = async (category: string) => {
        try {
            const res = await fetch(`/api/budget`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category }),
            });

            if (!res.ok) {
                throw new Error("Failed to delete invoice");
            }
            toast.success("Category deleted successfully.");
            // Update the state to remove the deleted category
            setCategories((prev) => prev.filter((cat) => cat !== category));
            setBudgets((prev) => prev.filter((budget) => budget.category !== category));
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Error deleting category.");
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Set Your Budgets</Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {categories.map((category) => (
                        <Box key={category} sx={{ marginBottom: 3 }}>

                            {/* with the regex we make sure that non numbers are not allowed!
                            mind that type="number" can cause problems like accidental value changes and its ugly anyways" */}
                            <Typography variant="h6">{category}</Typography>
                            <TextField
                                label="Budget"
                                type="text"
                                value={budgets.find((b) => b.category === category)?.amount || ""}
                                onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
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
                            {/* Delete Button */}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(category)}
                                sx={{ marginRight: 1 }}
                            >
                                Delete
                            </Button>
                        </Box>
                    ))}

                    {/* New Category Input */}
                    <Dialog open={Boolean(addingCategory)} onClose={() => setAddingCategory(false)}>
                        <DialogTitle>Add Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Category Name"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Budget"
                                fullWidth
                                type="text"
                                value={budget === 0 ? "" : budget}
                                onChange={(e) => setBudget(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
                                sx={{ marginBottom: 2 }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setAddingCategory(false)} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={addCategory} color="primary" disabled={postingCategoryTodb}>
                                {postingCategoryTodb ? <CircularProgress size={24} /> : "Add"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button variant="contained" color="secondary" sx={{ marginTop: 3, marginRight: 1 }} onClick={() => setAddingCategory(true)} disabled={addingCategory}>
                        Add Category
                    </Button>
                    <Button variant="contained" color="primary" onClick={saveBudgets} disabled={saving} sx={{ marginTop: 3 }}>
                        {saving ? "Saving..." : "Save Budgets"}
                    </Button>
                </>
            )}
        </Box>

    );
}

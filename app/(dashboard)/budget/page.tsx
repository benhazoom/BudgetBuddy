"use client";

import { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BudgetCard from "../../components/BudgetCard";
import { IconPicker } from "../../components/BudgetBuddyIcons";
interface Invoice {
  _id: string;
  name: string;
  category: string;
  amount: number;
}

interface Budget {
  category: string;
  amount: number;
  iconName: string;
}

export default function BudgetPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySums, setCategorySums] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [postingCategoryTodb, setPostingCategoryTodb] =
    useState<boolean>(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [icon, setIcon] = useState("home");

  useEffect(() => {
    async function fetchData() {
      try {
        const [invoicesRes, budgetsRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/budget"),
        ]);

        if (!invoicesRes.ok) throw new Error("Failed to fetch invoices");
        if (!budgetsRes.ok) throw new Error("Failed to fetch budgets");

        const invoicesData = await invoicesRes.json();
        const budgetsData = await budgetsRes.json();

        setInvoices(invoicesData);
        setBudgets(budgetsData);

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

  useEffect(() => {
    const sums: Record<string, number> = {};
    invoices.forEach((invoice) => {
      sums[invoice.category] =
        (sums[invoice.category] || 0) + Number(invoice.amount);
    });
    setCategorySums(sums);
  }, [invoices]);

  const handleBudgetChange = (category: string, amount: number) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        existing.amount = amount;
      } else {
        prev.push({ category, amount, iconName: "home" });
      }
      return [...prev];
    });
  };

  const addCategory = async () => {
    setPostingCategoryTodb(true);
    if (!name.trim()) return toast.error("Category name cannot be empty");
    if (categories.includes(name))
      return toast.error("Category already exists");

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: name,
          amount: budget,
          iconName: icon,
        }),
      });

      if (!res.ok) throw new Error("Failed to add category");

      setCategories((prev) => [...prev, name]);
      setBudgets((prev) => [
        ...prev,
        { category: name, amount: budget, iconName: icon },
      ]);
      toast.success("Category added successfully!");
      setAddingCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    } finally {
      setSaving(false);
      setPostingCategoryTodb(false);
    }
  };

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
      setCategories((prev) => prev.filter((cat) => cat !== category));
      setBudgets((prev) =>
        prev.filter((budget) => budget.category !== category)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category.");
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
        <>
          {categories.map((category) => {
            const budgetAmount =
              budgets.find((b) => b.category === category)?.amount || 0;
            const totalSpent = categorySums[category] || 0;
            const ratio = totalSpent / budgetAmount;
            const progress = (totalSpent / budgetAmount) * 100;

            return (
              <BudgetCard
                key={category}
                category={category}
                totalSpent={totalSpent}
                iconName={
                  budgets.find((b) => b.category === category)?.iconName ||
                  "defaultIcon"
                }
                budgetAmount={budgetAmount}
                ratio={ratio}
                progress={progress}
                onEdit={handleBudgetChange}
                onDelete={handleDelete}
              />
            );
          })}

          {/* adding category dialog */}
          <Dialog
            open={Boolean(addingCategory)}
            onClose={() => setAddingCategory(false)}
          >
            <DialogTitle>Add Category</DialogTitle>
            <DialogContent>
              <TextField
                label="Category Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ marginBottom: 2, marginTop: 2 }}
              />
              <TextField
                label="Budget"
                fullWidth
                type="text"
                value={budget === 0 ? "" : budget}
                onChange={(e) =>
                  setBudget(
                    parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0
                  )
                }
                sx={{ marginBottom: 2 }}
              />
              <IconPicker
                selectedIcon={icon}
                onSelect={(selectedIcon) => {
                  setIcon(selectedIcon);
                  console.log(selectedIcon, "selectedIcon");
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setAddingCategory(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={addCategory}
                color="primary"
                disabled={postingCategoryTodb}
              >
                {postingCategoryTodb ? <CircularProgress size={24} /> : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 3, marginRight: 1 }}
            onClick={() => setAddingCategory(true)}
            disabled={addingCategory}
          >
            Add Category
          </Button>
        </>
      )}
    </Box>
  );
}

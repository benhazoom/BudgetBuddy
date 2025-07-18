"use client";

import { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import InvoiceCard from "@/app/components/InvoiceCard";
import { useLanguage } from "@/app/contexts/LanguageContext";
interface Invoice {
  _id: string;
  name: string;
  category: string;
  amount: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [filterCategory, setFilterCategory] = useState("");
  const { translate } = useLanguage();

  const categories = Array.from(
    new Set(invoices.map((invoice) => invoice.category))
  );

  const isMobile = useMediaQuery('(max-width:600px)');

  // Function to delete invoice
  const handleDelete = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: invoiceId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete expanse");
      }

      // Remove the deleted invoice from the state
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
      toast.success(translate("expanseDeleted"));
    } catch (error) {
      console.error("Error deleting expanse:", error);
      toast.error(translate("errorDeletingExpanse"));
    }
  };

  // Function to open the edit form
  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setName(invoice.name);
    setCategory(invoice.category);
    setAmount(invoice.amount);
  };

  // Function to submit the edited invoice
  const handleUpdate = async () => {
    if (!editingInvoice) return;

    try {
      const res = await fetch("/api/invoices", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingInvoice._id,
          name,
          category,
          amount,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update expanse");
      }

      // Update the invoice in the state
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === editingInvoice._id
            ? { ...invoice, name, category, amount }
            : invoice
        )
      );
      toast.success(translate("expanseUpdated"));
      setEditingInvoice(null); // Close the edit form
    } catch (error) {
      console.error("Error updating expanse:", error);
      toast.error(translate("errorUpdatingExpanse"));
    }
  };

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices");
        if (!res.ok) throw new Error("Failed to fetch expanses");
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching expanses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  const filteredInvoices = filterCategory
    ? invoices.filter((invoice) => invoice.category === filterCategory)
    : invoices;

  return (
    <Box sx={{ padding: isMobile ? 0 : 3 }}>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>{translate("filterBudget")}</InputLabel>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          label={translate("filterBudget")}
        >
          <MenuItem value="">
            <em>{translate("all")}</em>
          </MenuItem>
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : filteredInvoices.length > 0 ? (
        filteredInvoices.map((invoice) => (
          <InvoiceCard
            key={invoice._id}
            category={invoice.category}
            name={invoice.name}
            amount={invoice.amount}
            onEdit={() => handleEdit(invoice)}
            onDelete={() => handleDelete(invoice._id)}
          />
        ))
      ) : (
        <Typography>{translate("noExpansesFound")}</Typography>
      )}

      {/* Edit Invoice Dialog */}
      <Dialog
        open={Boolean(editingInvoice)}
        onClose={() => setEditingInvoice(null)}
      >
        <DialogTitle>{translate("editExpanse")}</DialogTitle>
        <DialogContent>
          <TextField
            label={translate("name")}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            select
            label={translate("category")}
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={translate("amount")}
            fullWidth
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={(e) =>
              setAmount(parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0)
            }
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingInvoice(null)} color="secondary">
            {translate("cancel")}
          </Button>
          <Button onClick={handleUpdate} color="primary">
            {translate("update")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

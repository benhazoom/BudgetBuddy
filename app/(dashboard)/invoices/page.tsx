"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, Button, TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";

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

  const categories = ["Income", "Food", "Clothing", "Bills"];

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
        throw new Error("Failed to delete invoice");
      }

      // Remove the deleted invoice from the state
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
      toast.success("Invoice deleted successfully.");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Error deleting invoice.");
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
        throw new Error("Failed to update invoice");
      }

      // Update the invoice in the state
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === editingInvoice._id
            ? { ...invoice, name, category, amount }
            : invoice
        )
      );
      toast.success("Invoice updated successfully.");
      setEditingInvoice(null); // Close the edit form
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Error updating invoice.");
    }
  };

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices");
        if (!res.ok) throw new Error("Failed to fetch invoices");
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Invoices
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : invoices.length > 0 ? (
        invoices.map((invoice) => (
          <Box
            key={invoice._id}
            sx={{ border: "1px solid #ddd", padding: 2, marginBottom: 2 }}
          >
            <Typography variant="h6">{invoice.name}</Typography>
            <Typography>Category: {invoice.category}</Typography>
            <Typography>Amount: ${invoice.amount}</Typography>

            {/* Edit Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit(invoice)}
              sx={{ marginRight: 1 }}
            >
              Edit
            </Button>

            {/* Delete Button */}
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(invoice._id)}
            >
              Delete
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No invoices found.</Typography>
      )}

      {/* Edit Invoice Dialog */}
      <Dialog open={Boolean(editingInvoice)} onClose={() => setEditingInvoice(null)}>
        <DialogTitle>Edit Invoice</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            select
            label="Category"
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
            label="Amount"
            fullWidth
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingInvoice(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Typography, CircularProgress, LinearProgress } from "@mui/material";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SignedIn } from "@clerk/nextjs";

interface Invoice {
  _id: string;
  category: string;
  amount: number;
}

interface Budget {
  category: string;
  amount: number;
}

export default function HomePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorySums, setCategorySums] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [invoicesRes, budgetsRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/budget"),
        ]);

        if (!invoicesRes.ok || !budgetsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const invoicesData = await invoicesRes.json();
        const budgetsData = await budgetsRes.json();

        setInvoices(invoicesData);
        setBudgets(budgetsData);

        // Calculate total sum per category
        const sums: Record<string, number> = {};
        invoicesData.forEach((invoice: Invoice) => {
          sums[invoice.category] = (sums[invoice.category] || 0) + Number(invoice.amount);
        });
        setCategorySums(sums);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <SignedIn>
      <Box sx={{ padding: "20px" }}>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {budgets.map((budget, index) => {
              const sum = categorySums[budget.category] || 0;
              const ratio = budget.amount ? (sum / budget.amount).toFixed(2) : "N/A";
              const progress = budget.amount ? (sum / budget.amount) * 100 : 0;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        {budget.category}
                      </Typography>
                      <Typography variant="body2">
                        Total Spent: <b>${sum}</b> / <b>${budget.amount}</b>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Ratio: {ratio}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 5 }}
                        color={progress > 80 ? "error" : progress > 50 ? "warning" : "primary"}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="contained" color="primary" component={Link} href="/create-invoice" sx={{ px: 3, py: 1 }}>
                Add Invoice
              </Button>
            </Box>
          </Grid>
        )}

      </Box>
    </SignedIn>
  );
}

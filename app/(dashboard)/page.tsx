"use client";

import { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
    <>
      <SignedIn>


        {loading ? (
          <Typography variant="h6" component="div">
            <CircularProgress />
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: "20px" }}>
            {budgets.map((budget, index) => {
              const sum = categorySums[budget.category] || 0;
              const ratio = budget.amount ? (sum / budget.amount).toFixed(2) : "N/A";

              return (
                <Box key={index} sx={{ flex: "1 1 calc(25% - 16px)", boxSizing: "border-box" }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {budget.category}
                      </Typography>
                      <Typography variant="body2">
                        Total Spent: ${sum} / Budget: ${budget.amount}
                      </Typography>
                      <Typography variant="body2">Ratio: {ratio}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
            <Button variant="contained" color="primary" component={Link} href="/create-invoice">
              Add Invoice
            </Button>
          </Box >
        )
        }


      </SignedIn >
    </>
  );
}

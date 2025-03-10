"use client";

import { useEffect, useState } from "react";
import { Typography, CircularProgress, LinearProgress } from "@mui/material";
import ExpanseCard from "../components/ExpanseCard";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SignedIn } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { PieChart } from '@mui/x-charts/PieChart';
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

        // Check if there are no budgets and notify the user
        if (budgetsData.length === 0) {
          toast.info(
            "It appears you don't have budgeting categories yet. Default budgeting categories will be added. You can add and edit categories manually in the budget section."
          );
          await fetch("/api/budget", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              { category: "Food", amount: 500 },
              { category: "Clothing", amount: 500 },
              { category: "Bills", amount: 500 },
            ]),
          }).then(() => {
            window.location.reload(); // Reload the page to fetch the new budgets
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(categorySums).reduce((sum, val) => sum + val, 0);
  const budgetUsedPercentage = totalBudget ? (totalSpent / totalBudget) * 100 : 0;

  const chartData = budgets.map((budget) => ({
    name: budget.category,
    value: categorySums[budget.category] || 0,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  }));

  //An injective function (one-to-one function) ensures that different inputs always map to different colors
  function stringToColor(str: string) {
    let hash = 0;
    // Create a hash from the string
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to RGB color
    let color = "#";
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
}

  return (
    <SignedIn>
      
      <Box p={3}>
        <Card sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', boxShadow: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Typography variant="h6">Monthly Overview</Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
              ${totalSpent} <Typography component="span" color="textSecondary" variant="body2">of budget</Typography>
            </Typography>
            <Typography color="success.main">↓ ${totalBudget - totalSpent} Remaining</Typography>
            <LinearProgress variant="determinate" value={budgetUsedPercentage} sx={{ mt: 2 }} />
            <Typography variant="body2" color="textSecondary">{budgetUsedPercentage.toFixed(0)}% of monthly budget used</Typography>
          </Box>
          <Box sx={{ height: 300,width: 300 }}>
            <PieChart
              series={[
                {
                  data: chartData.map((entry) => ({ id: entry.name, value: entry.value, color: stringToColor(entry.name) })),
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 0,
                  cornerRadius: 0,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 150,
                  cy: 150,
                //   arcLabel: (item) => `${item.value}%`,
                //   arcLabelMinAngle: 35,
                //  arcLabelRadius: '60%',
      
                }
              ]}
            />
          </Box>
        </Card>
      </Box>

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
                    <ExpanseCard
                    category={budget.category}
                    totalSpent={sum}
                    budgetAmount={budget.amount}
                    ratio={ratio}
                    progress={progress}
                    />
                </Grid>
              );
            })}
          </Grid>
        )}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} href="/create-invoice" sx={{ px: 3, py: 1 }}>
            Create Invoice
          </Button>
        </Box>

      </Box>
    </SignedIn>
  );
}



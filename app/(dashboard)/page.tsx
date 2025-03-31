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
import { PieChart } from "@mui/x-charts/PieChart";
import { IconName } from "lucide-react/dynamic";
import { useCurrencyUtils } from "../utils/currency";

interface Invoice {
  _id: string;
  category: string;
  amount: number;
}

interface Budget {
  category: string;
  amount: number;
  iconName: string;
}

export default function HomePage() {
  const { formatCurrency } = useCurrencyUtils();
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

        //testing
        console.log("invoicesData", invoicesData);
        console.log("budgetsData", budgetsData);

        // Calculate total sum per category
        const sums: Record<string, number> = {};
        invoicesData.forEach((invoice: Invoice) => {
          sums[invoice.category] =
            (sums[invoice.category] || 0) + Number(invoice.amount);
        });
        setCategorySums(sums);

        // Check if there are no budgets and notify the user
        if (budgetsData.length === 0) {
          // Redirect to the category wizard page
          window.location.href = "/category-wizard";
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
  const totalSpent = Object.values(categorySums).reduce(
    (sum, val) => sum + val,
    0
  );
  const budgetUsedPercentage = totalBudget
    ? (totalSpent / totalBudget) * 100
    : 0;

  const colors = [
    "#3B82F6",
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#1E3A8A",
    "#D946EF",
    "#4B0082",
    "#ffe137",
    "#6e5109",
  ];

  const chartData = budgets.map((budget, index) => ({
    name: budget.category,
    value: categorySums[budget.category] || 0,
    color: colors[index % colors.length],
  }));

  return (
    <SignedIn>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        // Main container
        <Box sx={{ padding: "20px" }}>
          <Box pb={3}>
            <Card
              sx={{
                p: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                // justifyContent: "space-between",
                alignItems: "center",
                boxShadow: 3,
              }}
            >
              <Box sx={{ width: { xs: "100%", md: "30%" }, height: 300 }}>
                <Typography variant="h6" fontWeight="bold">
                  Monthly Overview
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mt: 6 }}
                >
                  Total Spent
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(totalSpent)}{" "}
                  <Typography
                    component="span"
                    color="textSecondary"
                    variant="body2"
                  >
                    of budget
                  </Typography>
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ mt: 2 }}
                >
                  Remaining Budget
                </Typography>
                <Typography color="success.main">
                  ↓ {formatCurrency(totalBudget - totalSpent)} Remaining
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={budgetUsedPercentage}
                  sx={{ mt: 4, height: 10, borderRadius: 4 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {budgetUsedPercentage.toFixed(0)}% of monthly budget used
                </Typography>
              </Box>

              {/* Pie chart */}
              <Box sx={{ height: 300, width: 500 }}>
                <PieChart
                  series={[
                    {
                      data: chartData.map((entry) => ({
                        id: entry.name,
                        value: entry.value,
                        color: entry.color,
                        label: entry.name,
                      })),
                      innerRadius: 60,
                      outerRadius: 100,
                      paddingAngle: 0,
                      cornerRadius: 0,
                      startAngle: 0,
                      endAngle: 360,
                    },
                  ]}
                  width={700}
                />
              </Box>
            </Card>
          </Box>

          {/*  Grid container for the category cards */}

          <Grid container spacing={3}>
            {budgets.map((budget, index) => {
              const sum = categorySums[budget.category] || 0;
              const ratio = budget.amount
                ? (sum / budget.amount).toFixed(2)
                : "N/A";
              const progress = budget.amount ? (sum / budget.amount) * 100 : 0;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <ExpanseCard
                    category={budget.category}
                    totalSpent={sum}
                    budgetAmount={budget.amount}
                    ratio={ratio}
                    progress={progress}
                    iconName={budget.iconName}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/create-expanse"
              sx={{ px: 3, py: 1 }}
            >
              Create Expanse
            </Button>
          </Box>
        </Box>
      )}
    </SignedIn>
  );
}

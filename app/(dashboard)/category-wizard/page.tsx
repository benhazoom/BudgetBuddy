"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  UtensilsCrossed,
  ShoppingBag,
  Receipt,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Film,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCurrencyUtils } from "../../utils/currency";
import { useCurrency } from "../../contexts/CurrencyContext";

const currencies = [
  { code: "NIS", symbol: "₪", name: "Israeli Shekel" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

interface Category {
  name: string;
  icon: React.ReactNode;
  defaultBudget: number;
  color: string;
  iconName: string;
}

interface CategorySelectorProps {
  onCategoriesSelected: (
    categories: Array<{ category: string; amount: number }>
  ) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategoriesSelected,
}) => {
  const { formatCurrency } = useCurrencyUtils();
  const { currency, setCurrency } = useCurrency();
  const [tempCurrency, setTempCurrency] = useState(currency || "NIS");
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const predefinedCategories: Category[] = [
    {
      name: "Housing",
      icon: <Home size={24} />,
      iconName: "home",
      defaultBudget: 500,
      color: "#9C27B0",
    },
    {
      name: "Groceries",
      icon: <UtensilsCrossed size={24} />,
      iconName: "utensils-crossed",
      defaultBudget: 500,
      color: "#FF5252",
    },
    {
      name: "Transportation",
      icon: <Car size={24} />,
      iconName: "car",
      defaultBudget: 500,
      color: "#8BC34A",
    },
    {
      name: "Health & Insurance",
      icon: <HeartPulse size={24} />,
      iconName: "heart-pulse",
      defaultBudget: 500,
      color: "#F44336",
    },
    {
      name: "Education & Childcare",
      icon: <GraduationCap size={24} />,
      iconName: "graduation-cap",
      defaultBudget: 500,
      color: "#673AB7",
    },
    {
      name: "Savings & Investments",
      icon: <Zap size={24} />,
      iconName: "zap",
      defaultBudget: 500,
      color: "#FFC107",
    },
    {
      name: "Debt & Loans",
      icon: <Receipt size={24} />,
      iconName: "receipt",
      defaultBudget: 500,
      color: "#FF9800",
    },
    {
      name: "Household & Maintenance",
      icon: <Home size={24} />,
      iconName: "home",
      defaultBudget: 500,
      color: "#3F51B5",
    },
    {
      name: "Entertainment & Leisure",
      icon: <Film size={24} />,
      iconName: "film",
      defaultBudget: 500,
      color: "#E91E63",
    },
    {
      name: "Clothing & Personal Care",
      icon: <ShoppingBag size={24} />,
      iconName: "shopping-bag",
      defaultBudget: 500,
      color: "#4285F4",
    },
    {
      name: "Restaurants",
      icon: <UtensilsCrossed size={24} />,
      iconName: "utensils-crossed",
      defaultBudget: 500,
      color: "#FF5722",
    },
    {
      name: "Charity (Tzedakah)",
      icon: <HeartPulse size={24} />,
      iconName: "heart-pulse",
      defaultBudget: 500,
      color: "#795548",
    },
  ];

  const handleToggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleCurrencyChange = (event: any) => {
    const newCurrency = event.target.value;
    setTempCurrency(newCurrency);
    setCurrency(newCurrency);
  };

  const handleDone = async () => {
    const selected = Object.keys(selectedCategories);

    if (selected.length === 0) {
      toast.error(
        "No categories selected, Please select at least one category to continue"
      );
      return;
    }

    const categoriesToSave = selected.map((category) => {
      const selectedCategory = predefinedCategories.find(
        (cat) => cat.name === category
      );
      return {
        category,
        amount: 500,
        iconName: selectedCategory?.iconName,
      };
    });

    await fetch("/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriesToSave),
    });
    window.location.href = "/";
  };

  return (
    <Card
      sx={{
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        maxWidth: 800,
        mx: "auto",
        mt: 4,
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          Welcome to BudgetBuddy
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "medium",
            mb: 3,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          Lets set up your budget categories
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            First, select your preferred currency
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Default Currency</InputLabel>
            <Select
              value={tempCurrency}
              label="Default Currency"
              onChange={handleCurrencyChange}
            >
              {currencies.map((curr) => (
                <MenuItem key={curr.code} value={curr.code}>
                  {curr.name} ({curr.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "medium", mb: 2 }}
        >
          Select the categories you want to track:
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {predefinedCategories.map((category) => (
            <Grid
              item
              xs={12}
              sm={10}
              md={8}
              lg={6}
              key={`${category.name}-${tempCurrency}`}
            >
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: selectedCategories[category.name]
                    ? "primary.main"
                    : "divider",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: selectedCategories[category.name]
                    ? "rgba(25, 118, 210, 0.08)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
                onClick={() => handleToggleCategory(category.name)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.04)",
                      color: category.color,
                      mr: 2,
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "medium" }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Default Budget: {formatCurrency(category.defaultBudget)}
                    </Typography>
                  </Box>
                  <Checkbox
                    checked={!!selectedCategories[category.name]}
                    onChange={() => handleToggleCategory(category.name)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleDone}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
          >
            Continue to Dashboard
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategorySelector;

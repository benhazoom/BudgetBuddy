import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaymentIcon from "@mui/icons-material/Payment";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HomeIcon from "@mui/icons-material/Home";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { getCategoryIcon } from "./BudgetBuddyIcons";
import { useCurrencyUtils } from "../utils/currency";
import { useLanguage } from "../contexts/LanguageContext";

// Get color based on budget usage percentage
const getProgressColor = (progress: number) => {
  if (progress > 80) return "#f44336"; // red
  if (progress > 50) return "#ff9800"; // orange
  return "#4CAF50"; // green
};

interface ExpenseCardProps {
  category: string;
  totalSpent: number;
  budgetAmount: number;
  ratio: string;
  progress: number;
  iconName: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  category,
  totalSpent,
  budgetAmount,
  ratio,
  progress,
  iconName,
}) => {
  const { formatCurrency } = useCurrencyUtils();
  const { translate } = useLanguage();
  const isUnder = totalSpent <= budgetAmount;
  const progressColor = getProgressColor(progress);

  return (
    <Card
      sx={{
        p: 2,
        boxShadow: 2,
        borderRadius: 2,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        height: "200px",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.04)",
              mr: 2,
            }}
          >
            {getCategoryIcon(iconName)}
          </Box>
          <Typography variant="h6">
            <strong>{category}</strong>
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {translate("spent")}: <strong>{formatCurrency(totalSpent)}</strong> /{" "}
          {translate("goal")}: <strong>{formatCurrency(budgetAmount)}</strong>
        </Typography>

        <Box sx={{ position: "relative", mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(0,0,0,0.08)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: isUnder ? progressColor : "#f44336",
              },
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {progress.toFixed(0)}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;

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
import IconRenderer from "./IconRenderer";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

// // Map category to icon
// const getCategoryIcon = (category: string) => {
//   switch (category.toLowerCase()) {
//     case "food":
//       return <RestaurantIcon sx={{ color: "#FF5252" }} />;
//     case "clothing":
//       return <ShoppingBagIcon sx={{ color: "#4285F4" }} />;
//     case "bills":
//       return <PaymentIcon sx={{ color: "#FF9800" }} />;
//     case "video games":
//       return <SportsEsportsIcon sx={{ color: "#42A5F5" }} />;
//     default:
//       return <HomeIcon sx={{ color: "#9C27B0" }} />;
//   }
// };

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
  iconName: String;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  category,
  totalSpent,
  budgetAmount,
  ratio,
  progress,
  iconName,
}) => {
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
            <DynamicIcon name={iconName as IconName} />
          </Box>
          <Typography variant="h6">
            <strong>{category}</strong>
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Spent: <strong>${totalSpent}</strong> / Goal:{" "}
          <strong>${budgetAmount}</strong>
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

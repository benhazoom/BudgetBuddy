import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { getCategoryIcon } from "./BudgetBuddyIcons";

// Get color based on budget usage percentage
const getProgressColor = (progress: number) => {
  if (progress > 80) return "#f44336"; // red
  if (progress > 50) return "#ff9800"; // orange
  return "#4CAF50"; // green
};

interface BudgetCardProps {
  category: string;
  totalSpent: number;
  budgetAmount: number;
  iconName: string;
  ratio: number;
  progress: number;
  onEdit: (category: string, amount: number) => void;
  onDelete: (category: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  totalSpent,
  budgetAmount,
  iconName,
  ratio,
  progress,
  onEdit,
  onDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAmount, setNewAmount] = useState(budgetAmount);
  const [saving, setSaving] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const budgets = [{ category, amount: newAmount, iconName }];
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgets),
      });

      if (!res.ok) throw new Error("Failed to save budgets");
      onEdit(category, newAmount);
      toast.success("Budgets saved successfully");
      // toast.router.push("/");
    } catch (error) {
      console.error("Error saving budgets:", error);
      toast.error("Error saving budgets");
    } finally {
      setSaving(false);
    }
    setIsDialogOpen(false);
  };

  // const handleSave = () => {
  //   onEdit(category, newAmount);
  //   setIsDialogOpen(false);
  // };
  const isUnder = totalSpent <= budgetAmount;
  const progressColor = getProgressColor(progress);

  return (
    <>
      <Card
        sx={{
          m: 2,
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
              {getCategoryIcon(iconName)}
            </Box>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <strong>{category}</strong>
            </Typography>
            <IconButton onClick={handleEditClick} aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(category)} aria-label="delete">
              <DeleteIcon />
            </IconButton>
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

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Budget Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}></Box>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Select Icon:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[
              "home",
              "utensils-crossed",
              "shirt",
              "receipt",
              "gamepad-2",
              "car",
              "heart-pulse",
              "graduation-cap",
              "plane",
              "film",
              "dog",
              "zap",
              "shopping-cart",
              "book-open",
              "credit-card",
              "dumbbell",
              "gift",
              "briefcase",
              "music",
              "paw-print",
              "library",
              "users",
              "shopping-bag",
              "utensils",
            ].map((icon) => (
              <Box>{getCategoryIcon(icon)}</Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetCard;

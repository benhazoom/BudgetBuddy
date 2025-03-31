import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useCurrencyUtils } from "../utils/currency";
import { IconPicker } from "./BudgetBuddyIcons";
import { getCategoryIcon } from "./BudgetBuddyIcons";
import { useLanguage } from "../contexts/LanguageContext";

interface BudgetCardProps {
  category: string;
  totalSpent: number;
  budgetAmount: number;
  iconName: string;
  ratio: number;
  progress: number;
  onEdit: (category: string, amount: number, iconName: string) => void;
  onDelete: (category: string) => void;
}

const getProgressColor = (progress: number) => {
  if (progress >= 100) return "#EF4444";
  if (progress >= 80) return "#F59E0B";
  return "#10B981";
};

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
  const { formatCurrency } = useCurrencyUtils();
  const { translate } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAmount, setNewAmount] = useState(budgetAmount);
  const [saving, setSaving] = useState(false);
  const [icon, setIcon] = useState(iconName);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/budget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          amount: newAmount,
          iconName: icon,
        }),
      });

      if (!res.ok) throw new Error("Failed to save budgets");
      onEdit(category, newAmount, icon);
      toast.success(translate("budgetSaved"));
    } catch (error) {
      console.error("Error saving budgets:", error);
      toast.error(translate("errorSavingBudget"));
    } finally {
      setSaving(false);
    }
    setIsDialogOpen(false);
  };

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
            boxShadow: 4,
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
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {translate("budget")}: {formatCurrency(budgetAmount)}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={handleEditClick} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(category)} color="error">
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {translate("spent")}: {formatCurrency(totalSpent)}
              </Typography>
              <Typography
                variant="body2"
                color={isUnder ? "success.main" : "error.main"}
              >
                {isUnder ? translate("underBudget") : translate("overBudget")}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progressColor,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{translate("editBudget")}</DialogTitle>
        <DialogContent>
          <TextField
            label={translate("amount")}
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
          <IconPicker selectedIcon={icon} onSelect={setIcon} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{translate("cancel")}</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : translate("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetCard;

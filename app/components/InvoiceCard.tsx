import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface InvoiceCardProps {
  category: string;
  name: string;
  amount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InvoiceCard({
  category,
  name,
  amount,
  onEdit,
  onDelete,
}: InvoiceCardProps) {
  return (
    <Card sx={{ m: 2, p: 2, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ${amount}
            </Typography>
          </Box>
          <Chip label={category} variant="outlined" />
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

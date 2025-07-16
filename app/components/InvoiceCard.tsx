import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCurrencyUtils } from "../utils/currency";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { formatCurrency } = useCurrencyUtils();
  const { translate } = useLanguage();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Card
      sx={{
        mx: isMobile ? 0 : 2,
        mt: 2,
        mb: 2,
        py: 2,
        px: isMobile ? 1 : 2,
        pr: isMobile ? 0 : 2,
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
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            {/* Left: name, amount, category */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {name}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {formatCurrency(amount)}
              </Typography>
              <Chip label={category} variant="outlined" sx={{ mt: 1 }} />
            </Box>
            {/* Right: edit/delete */}
            <Box>
              <IconButton onClick={() => onEdit()} aria-label={translate("edit")} sx={{ m: 2 }}> <EditIcon /> </IconButton>
              <IconButton onClick={() => onDelete()} aria-label={translate("delete")}> <DeleteIcon /> </IconButton>
            </Box>
          </Box>
        ) : (
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
                {formatCurrency(amount)}
              </Typography>
            </Box>
            <Box sx={{ minWidth: "250px" }}>
              <IconButton onClick={() => onEdit()} aria-label={translate("edit")}> <EditIcon /> </IconButton>
              <IconButton onClick={() => onDelete()} aria-label={translate("delete")}> <DeleteIcon /> </IconButton>
              <Chip label={category} variant="outlined" />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

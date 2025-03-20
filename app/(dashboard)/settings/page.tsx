"use client";

import * as React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useCurrency } from "../../contexts/CurrencyContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "NIS", symbol: "₪", name: "Israeli Shekel" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export default function SettingsPage() {
  const { currency, setCurrency } = useCurrency();
  const [tempCurrency, setTempCurrency] = React.useState(currency);
  const router = useRouter();

  const handleCurrencyChange = (event: any) => {
    setTempCurrency(event.target.value);
  };

  const handleSave = () => {
    setCurrency(tempCurrency);
    toast.success("Settings saved successfully!");
    router.push("/");
  };

  const handleDiscard = () => {
    setTempCurrency(currency);
    router.push("/");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleDiscard}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4">Settings</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Currency Settings
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
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

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={handleDiscard}>
              Discard Changes
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={tempCurrency === currency}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

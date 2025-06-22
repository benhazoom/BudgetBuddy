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
  Divider,
} from "@mui/material";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { LANGUAGES, getTranslation } from "../../lib/translations";
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
  const { language, setLanguage, translate } = useLanguage();
  const [tempCurrency, setTempCurrency] = React.useState(currency);
  const [tempLanguage, setTempLanguage] = React.useState(language);
  const router = useRouter();

  const handleCurrencyChange = (event: any) => {
    setTempCurrency(event.target.value);
  };

  const handleLanguageChange = (event: any) => {
    setTempLanguage(event.target.value);
  };

  const handleSave = () => {
    setCurrency(tempCurrency);
    setLanguage(tempLanguage);
    toast.success(getTranslation("settingsSaved", tempLanguage));
    router.push("/");
  };

  const handleDiscard = () => {
    setTempCurrency(currency);
    setTempLanguage(language);
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
            {translate("back")}
          </Button>
          <Typography variant="h4">{translate("settings")}</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {translate("currency")}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{translate("defaultCurrency")}</InputLabel>
            <Select
              value={tempCurrency}
              label={translate("defaultCurrency")}
              onChange={handleCurrencyChange}
            >
              {currencies.map((curr) => (
                <MenuItem key={curr.code} value={curr.code}>
                  {curr.name} ({curr.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            {translate("language")}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{translate("language")}</InputLabel>
            <Select
              value={tempLanguage}
              label={translate("language")}
              onChange={handleLanguageChange}
            >
              {Object.entries(LANGUAGES).map(([code, config]) => (
                <MenuItem key={code} value={code}>
                  {(config as { name: string }).name}
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
              {translate("discardChanges")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={tempCurrency === currency && tempLanguage === language}
            >
              {translate("saveChanges")}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

"use client";

import { useCurrency } from "../contexts/CurrencyContext";

const currencySymbols: { [key: string]: string } = {
  NIS: "₪",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export function useCurrencyUtils() {
  const { currency } = useCurrency();
  const symbol = currencySymbols[currency] || "₪";


  const formatCurrency = (amount: number | string): string => {
    // Convert amount to number and handle invalid inputs
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return `${symbol}0.00`;
    }
    
    // Format the number with 2 decimal places
    const formattedAmount = numericAmount.toFixed(2);
    
    // Add the currency symbol based on the currency
    return `${symbol}${formattedAmount}`;
  };

  const getCurrencySymbol = (): string => {
    return symbol;
  };

  const parseCurrency = (value: string): number => {
    // Remove the currency symbol and any commas
    const cleanValue = value.replace(symbol, "").replace(/,/g, "");
    
    // Parse the number
    return parseFloat(cleanValue) || 0;
  };

  return {
    formatCurrency,
    getCurrencySymbol,
    parseCurrency,
    currentCurrency: currency
  };
} 
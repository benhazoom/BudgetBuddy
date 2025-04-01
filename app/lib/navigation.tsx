"use client";

import { Navigation } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

export function getNavigation(translate: (key: string) => string): Navigation {
  return [
    {
      kind: "header",
      title: translate("mainItems"),
    },
    {
      segment: "",
      title: translate("dashboard"),
      icon: <DashboardIcon />,
    },
    {
      segment: "expanse",
      title: translate("expanses"),
      icon: <ShoppingCartIcon />,
    },
    {
      segment: "budget",
      title: translate("budgets"),
      icon: <AttachMoneyIcon />,
    },
    {
      segment: "create-expanse",
      title: translate("createExpanse"),
      icon: <AddIcon />,
    },
    {
      segment: "settings",
      title: translate("settings"),
      icon: <SettingsIcon />,
    },
  ];
}

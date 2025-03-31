import * as React from "react";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LinearProgress from "@mui/material/LinearProgress";
import type { Navigation } from "@toolpad/core/AppProvider";
import SettingsIcon from "@mui/icons-material/Settings";

import theme from "../theme";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import { ClerkProvider, SignedOut, SignedIn, SignIn } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "expanse",
    title: "Expanses",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "budget",
    title: "Budgets",
    icon: <AttachMoneyIcon />,
  },
  {
    segment: "create-expanse",
    title: "Create Expanse",
    icon: <AddIcon />,
  },
  {
    segment: "settings",
    title: "Settings",
    icon: <SettingsIcon />,
  },
];

const BRANDING = {
  title: "Budget Buddy",
  logo: <img src="/budgetbuddy_logo.png" alt="BudgetBuddy logo" />,
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <ClerkProvider>
          <CurrencyProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <React.Suspense fallback={<LinearProgress />}>
                <SignedIn>
                  <ToastContainer />
                  <NextAppProvider
                    navigation={NAVIGATION}
                    branding={BRANDING}
                    theme={theme}
                  >
                    {props.children}
                  </NextAppProvider>
                </SignedIn>

                <SignedOut>
                  <div
                    style={{
                      backgroundImage: 'url("/hhholographic16X9.jpg")',
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "100vh",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <SignIn routing="hash" />
                    </div>
                  </div>
                </SignedOut>
              </React.Suspense>
            </AppRouterCacheProvider>
          </CurrencyProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

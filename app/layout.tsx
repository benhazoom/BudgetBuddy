import * as React from "react";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import LinearProgress from "@mui/material/LinearProgress";
import { ClerkProvider, SignedOut, SignedIn, SignIn } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NavigationWrapper } from "./components/NavigationWrapper";
import theme from "../theme";

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
                  <LanguageProvider>
                    <NavigationWrapper branding={BRANDING} theme={theme}>
                      {props.children}
                    </NavigationWrapper>
                  </LanguageProvider>
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

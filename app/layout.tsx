import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LinearProgress from '@mui/material/LinearProgress'
import type { Navigation } from '@toolpad/core/AppProvider';

import theme from '../theme';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import { ClerkProvider, SignedOut, SignedIn, SignIn } from '@clerk/nextjs';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'invoices',
    title: 'Invoices',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'budget',
    title: 'Budget',
    icon: <AttachMoneyIcon />,
  },
  {
    segment: 'create-invoice',
    title: 'Create Invoice',
    icon: <AddIcon />,
  },
];

const BRANDING = {
  title: 'Budget Buddy',
  logo: <img src="/budgetbuddy_logo.png" alt="BudgetBuddy logo" />,

};



export default function RootLayout(props: { children: React.ReactNode }) {


  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <ClerkProvider>

          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <React.Suspense fallback={<LinearProgress />}>

              <SignedIn>

                <NextAppProvider
                  navigation={NAVIGATION}
                  branding={BRANDING}
                  theme={theme}
                >
                  {props.children}
                </NextAppProvider>

              </SignedIn>


              <SignedOut>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <SignIn routing='hash' />
                </div>
              </SignedOut>
            </React.Suspense>
          </AppRouterCacheProvider>
        </ClerkProvider>

      </body>
    </html>
  );
}

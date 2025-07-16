"use client";

import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { UserButton } from "@clerk/nextjs";
import { Chip, Stack, Typography, Tooltip, useMediaQuery } from "@mui/material";
import {
  CloudCircle as CloudCircleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { LanguageProvider } from "../contexts/LanguageContext";

function CustomUserButton() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <UserButton />
    </div>
  );
}
function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <img
        src="/budgetbuddy_logo.png"
        alt="Budget Buddy Logo"
        style={{ height: 40 }}
      />
      <Typography variant="h6" style={{ fontWeight: "bold" }}>
        Budget Buddy
      </Typography>
      <Chip size="small" label="Alpha" color="info" />
      {/* <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip> */}
    </Stack>
  );
}

function MobileCustomAppTitle() {
  return (
    <Typography variant="h6" style={{ fontWeight: "bold" }} marginTop={0.5} marginLeft={1}>
      Budget Buddy
    </Typography>
  );
}

export default function Layout(props: { children: React.ReactNode }) {
  // Use MUI's useMediaQuery to detect mobile view (xs or sm)
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <DashboardLayout
      slots={{
        appTitle: isMobile ? MobileCustomAppTitle : CustomAppTitle,
        toolbarAccount: CustomUserButton,
      }}
    >
      {/* <LanguageProvider> */}
      <PageContainer>{props.children}</PageContainer>
      {/* </LanguageProvider> */}
    </DashboardLayout>
  );
}

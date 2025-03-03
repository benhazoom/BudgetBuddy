'use client'

import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { UserButton } from '@clerk/nextjs';

function CustomUserButton() {
  return (

    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <UserButton />
    </div>
  )
}

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      slots={{
        toolbarAccount: CustomUserButton
      }}>
      <PageContainer>{props.children}</PageContainer>
    </DashboardLayout>
  );
}  

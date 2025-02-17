import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { UserButton } from '@clerk/nextjs';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <UserButton showName />
      </div>
      <PageContainer>{props.children}</PageContainer>
    </DashboardLayout>
  );
}  

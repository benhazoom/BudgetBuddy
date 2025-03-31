"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { getNavigation } from "../lib/navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";

interface NavigationWrapperProps {
  children: React.ReactNode;
  branding: any;
  theme: any;
}

export function NavigationWrapper({
  children,
  branding,
  theme,
}: NavigationWrapperProps) {
  const { translate } = useLanguage();
  const navigation = getNavigation(translate);

  return (
    <NextAppProvider navigation={navigation} branding={branding} theme={theme}>
      {children}
    </NextAppProvider>
  );
}

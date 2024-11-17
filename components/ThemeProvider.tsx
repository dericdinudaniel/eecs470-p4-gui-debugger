"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// @ts-ignore
export function ThemeProvider({
  // @ts-ignore
  children,
  ...props
}: // @ts-ignore
React.ComponentProps<typeof NextThemesProvider>) {
  // @ts-ignore
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

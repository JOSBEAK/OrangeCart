"use client";

import { useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import ErrorBoundary from "@/components/misc/ErrorBoundary";
import ErrorFallback from "@/components/misc/ErrorFallback";
import ClientProvider from "./ClientProvider";
import NavBar from "@/components/process/NavBar";

export default function ClientLayout({ children }) {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = sessionStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      sessionStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ClientProvider>
          {/* <ProtectedLayout> */}
          <Box>
            <NavBar mode={mode} toggleTheme={toggleTheme} />
            {children}
          </Box>
          {/* </ProtectedLayout> */}
        </ClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { theme } from "./theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

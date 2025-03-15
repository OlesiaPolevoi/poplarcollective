import React from "react";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Layout from "../components/Layout";
import "../styles/globals.css";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green color for Poplar theme
    },
    secondary: {
      main: "#FFC107", // Amber as secondary color
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;

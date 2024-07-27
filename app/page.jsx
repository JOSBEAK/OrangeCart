"use client";
import Link from "next/link";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";

export default function Home() {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #263238, #212121)"
            : "linear-gradient(to bottom, #fff3e0, #ffe0b2)",
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: theme.palette.mode === "dark" ? "#ffb74d" : "#e65100",
              fontWeight: "bold",
            }}
          >
            Welcome to Orange Cart
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: theme.palette.mode === "dark" ? "#ffa726" : "#ef6c00",
            }}
          >
            Your one-stop shop for all Your stuff!
          </Typography>

          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/checkout"
            sx={{
              py: 2,
              px: 4,
              fontWeight: "bold",

              fontSize: "1.2rem",
              bgcolor: theme.palette.mode === "dark" ? "#FFA500" : "#FF8C00",
              "&:hover": {
                bgcolor: theme.palette.mode === "dark" ? "#FFB74D" : "#FFA500",
              },
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

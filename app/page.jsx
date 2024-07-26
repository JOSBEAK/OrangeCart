import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #fff3e0, #ffe0b2)",
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ color: "#e65100", fontWeight: "bold" }}
          >
            Welcome to Orange Cart
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: "#ef6c00" }}>
            Your one-stop shop for all Your stuff!
          </Typography>
          {/* <Link href="/checkout?current=bag" passHref> */}
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/checkout?current=bag"
            sx={{
              py: 2,
              px: 4,
              fontSize: "1.2rem",
              bgcolor: "#FF8C00",
              "&:hover": {
                bgcolor: "#FFA500",
              },
            }}
          >
            Start Shopping
          </Button>
          {/* </Link> */}
        </Box>
      </Container>
    </Box>
  );
}

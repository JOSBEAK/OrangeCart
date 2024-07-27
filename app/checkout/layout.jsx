import { Box, Container } from "@mui/material";

export default function CheckoutLayout({ children }) {
  return (
    <Box
      component="main"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Box
        component="header"
        sx={{
          padding: 2,
          position: "relative",
        }}
      >
        {/* Header content can be added here if needed */}
      </Box>
      <Container
        component="section"
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: 2,
        }}
      >
        <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
      </Container>
    </Box>
  );
}

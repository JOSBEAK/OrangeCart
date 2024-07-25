// components/ErrorFallback.jsx
import { Box, Typography, Button } from "@mui/material";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" gutterBottom>
        We are sorry for the inconvenience. Please try again later.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={resetErrorBoundary}
        sx={{ marginTop: 2 }}
      >
        Try Again
      </Button>
    </Box>
  );
};

export default ErrorFallback;

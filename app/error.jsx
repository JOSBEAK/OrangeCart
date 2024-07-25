// app/error.jsx
"use client";

import { useEffect } from "react";
import { Box, Typography, Button, SvgIcon } from "@mui/material";

const OrangeIcon = (props) => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.86 0-95.19-15.58-134.2-44.86c-14.14-10.59-17-30.66-6.391-44.81c10.61-14.09 30.69-16.97 44.8-6.375c27.84 20.91 61 31.94 95.89 31.94C344.3 415.8 416 344.1 416 256s-71.67-159.8-159.8-159.8C205.9 96.22 158.6 120.3 128.6 160H192c17.67 0 32 14.31 32 32s-14.33 32-32 32H48c-17.67 0-32-14.31-32-32V48c0-17.69 14.33-32 32-32s32 14.31 32 32v70.23C122.5 64.91 186.1 32.22 256.1 32.22C379.5 32.22 480 132.7 480 256z"
        fill="#FFA500"
      />
    </svg>
  </SvgIcon>
);

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        backgroundColor: "#FFF3E0",
      }}
    >
      <OrangeIcon sx={{ fontSize: 80, color: "#FFA500", marginBottom: 2 }} />
      <Typography variant="h4" gutterBottom sx={{ color: "#E65100" }}>
        Oops! Something went wrong at Orange Mart
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3, color: "#424242" }}>
        We apologize for the inconvenience. Our team has been notified and is
        working on it.
      </Typography>
      <Button
        onClick={() => reset()}
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: "#FFA500",
          "&:hover": {
            backgroundColor: "#FF8C00",
          },
        }}
      >
        Try again
      </Button>
    </Box>
  );
}

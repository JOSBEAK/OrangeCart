import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <CircularProgress />
    </div>
  );
}

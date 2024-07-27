import { useTheme } from "@emotion/react";

function buttonStyle(isCartEmpty) {
  const buttonStyle = {
    backgroundColor: isCartEmpty ? "#ccc" : "#FF8C00",
    color: isCartEmpty ? "ccc" : "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: isCartEmpty ? "#ccc" : "#FFA500",
    },
    "&.Mui-disabled": {
      color: "grey.700",
    },
  };

  return buttonStyle;
}

export default buttonStyle;

function buttonStyle(isCartEmpty) {
  const buttonStyle = {
    backgroundColor: isCartEmpty ? "#ccc" : "#FF8C00",
    color: isCartEmpty ? "#666" : "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: isCartEmpty ? "#ccc" : "#FFA500",
    },
  };

  return buttonStyle;
}

export default buttonStyle;

import React from "react";
import Image from "next/image";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const ItemCard = ({ item, minimal = false }) => {
  return (
    <Card>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: minimal ? 140 : 150,
        }}
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Box>
      <CardContent>
        <Typography variant="subtitle1" noWrap gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="h6" color="primary.main">
          ₹{item.price}
        </Typography>
        <Chip
          label={`Qty: ${item.quantity}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </CardContent>
    </Card>
  );
};

export default ItemCard;

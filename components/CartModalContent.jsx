"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
} from "@mui/material";
import EmptyCart from "./EmptyCart";

const CartModalContent = ({ open, handleClose }) => {
  const { items, status } = useSelector((state) => state.cart);

  if (items.length === 0 && status !== "idle") {
    return <EmptyCart handleClose={handleClose} />;
  }

  return (
    <Box sx={{ p: 2, maxWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Cart Items
      </Typography>
      <List>
        {items.map((item, index) => (
          <div key={item.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {open && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity} - ₹${item.price.toFixed(
                  2
                )}`}
              />
            </ListItem>
            {index < items.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </div>
        ))}
      </List>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          component={Link}
          href="/checkout?current=bag"
          sx={{
            backgroundColor: "#FF8C00",
            "&:hover": {
              backgroundColor: "#FFA500",
            },
          }}
          onClick={handleClose}
        >
          Go to Cart
        </Button>
      </Box>
    </Box>
  );
};
export default CartModalContent;

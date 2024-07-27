import React from "react";
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
  IconButton,
  Badge,
  styled,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import EmptyCart from "./EmptyCart";

const StyledBox = styled(Box)(({ theme }) => ({
  maxWidth: 350,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledImage = styled(Image)({
  borderRadius: "50%",
  objectFit: "cover",
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const CartModalContent = ({ open, handleClose }) => {
  const { items, status } = useSelector((state) => state.cart);

  if (items.length === 0 && status !== "idle") {
    return <EmptyCart handleClose={handleClose} />;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Your Cart
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ maxHeight: 300, overflowY: "auto", scrollbarWidth: "none" }}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <StyledListItem alignItems="center">
              <ListItemAvatar>
                {open && (
                  <StyledImage
                    src={item.thumbnail}
                    alt={item.title}
                    width={50}
                    height={50}
                    loading="lazy"
                  />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >{`  ₹${item.price.toFixed(2)}`}</Typography>
                }
              />
              <Badge badgeContent={item.quantity} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </StyledListItem>
            {index < items.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      <Box p={2} textAlign="center">
        <StyledButton
          variant="contained"
          component={Link}
          href="/checkout"
          onClick={handleClose}
          fullWidth
          startIcon={<ShoppingCartIcon />}
        >
          Proceed to Checkout
        </StyledButton>
      </Box>
    </Box>
  );
};

export default CartModalContent;

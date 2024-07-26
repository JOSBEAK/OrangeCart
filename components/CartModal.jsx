"use client";

import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { Popover, CircularProgress, Box } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/lib/slices/cartSlice";
import LoadingSpinner from "./LoadingSpinner";
const CartModalContent = dynamic(() => import("./CartModalContent"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const CartModal = ({ open, anchorEl, handleClose }) => {
  const status = useSelector((state) => state.cart.status);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status !== "succeeded") dispatch(fetchCart());
  }, [dispatch, status]);
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box
        sx={{
          p: 2,
          minWidth: 300,
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CartModalContent open={open} handleClose={handleClose} />
      </Box>
    </Popover>
  );
};
export default CartModal;

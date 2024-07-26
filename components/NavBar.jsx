"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

const CartModal = dynamic(() => import("./CartModal"));

const NavBar = ({ mode, toggleTheme }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const { items } = useSelector((state) => state.cart);

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: "bold",
            color: "#FF8C00",
          }}
          onClick={() => router.push("/")}
        >
          ORANGE CART
        </Typography>

        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={items.length} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Suspense fallback={<LoadingSpinner />}>
          {open && (
            <CartModal
              open={open}
              anchorEl={anchorEl}
              handleClose={handleClose}
            />
          )}
        </Suspense>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;

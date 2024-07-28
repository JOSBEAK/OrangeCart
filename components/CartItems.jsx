import React from "react";
import Image from "next/image";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CartItemsSkeleton from "./CartItemsSkeleton";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartItems = ({ items, isLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (isLoading) {
    return <CartItemsSkeleton />;
  }

  if (!items || items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <ShoppingCartIcon sx={{ fontSize: 100, color: "#FF8C00", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you have not added any items to your cart yet.
        </Typography>

        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/"
          sx={{
            backgroundColor: "#FF8C00",
            "&:hover": {
              backgroundColor: "#FFA500",
            },
          }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} key={item.id}>
          <Card
            elevation={3}
            sx={{
              display: "flex",
              mb: 2,
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[10],
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                flexShrink: 0,
                width: { xs: "100px", sm: "150px" },
              }}
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 600px) 100px, 150px"
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                padding: isMobile ? "8px !important" : "16px !important",
              }}
            >
              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="div"
                  sx={{
                    fontSize: isMobile
                      ? "0.9rem"
                      : isTablet
                      ? "1.1rem"
                      : "1.25rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={isMobile ? 1 : 2}
              >
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  color="primary.main"
                  sx={{
                    fontSize: isMobile
                      ? "1rem"
                      : isTablet
                      ? "1.1rem"
                      : "1.25rem",
                  }}
                >
                  ₹{item.price.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CartItems;

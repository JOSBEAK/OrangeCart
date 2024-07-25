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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CartItemsSkeleton from "./CartItemsSkeleton";

const CartItems = ({ items, isLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (isLoading) {
    return <CartItemsSkeleton />;
  }

  if (!items || items.length === 0) {
    return (
      <Typography variant="h6" align="center">
        Your cart is empty.
      </Typography>
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
                width: isMobile ? 100 : 150,
                height: isMobile ? 100 : 150,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                priority
              />
            </Box>
            <CardContent
              sx={{
                flex: "1 0 auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: `calc(100% - ${isMobile ? 100 : 150}px)`,
                padding: isMobile ? "8px !important" : "16px !important",
              }}
            >
              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="div"
                  noWrap
                  sx={{
                    fontSize: isMobile
                      ? "0.9rem"
                      : isTablet
                      ? "1.1rem"
                      : "1.25rem",
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
                    flexGrow: 1,
                  }}
                >
                  ₹{item.price.toFixed(2)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton size={isMobile ? "small" : "medium"}>
                    <RemoveIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                  <Chip
                    label={item.quantity}
                    size={isMobile ? "small" : "medium"}
                    color="primary"
                    sx={{
                      mx: 0.5,
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                    }}
                  />
                  <IconButton size={isMobile ? "small" : "medium"}>
                    <AddIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Box>
                <IconButton color="error" size={isMobile ? "small" : "medium"}>
                  <DeleteOutlineIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
          <Divider sx={{ my: isMobile ? 1 : 2 }} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CartItems;

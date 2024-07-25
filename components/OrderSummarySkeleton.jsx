import React from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  Skeleton,
  Chip,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DiscountIcon from "@mui/icons-material/Discount";
import { useSearchParams } from "next/navigation";

const OrderSummarySkeleton = () => {
  const SummaryItemSkeleton = ({ icon }) => (
    <ListItem disableGutters>
      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>{icon}</Avatar>
      <ListItemText primary={<Skeleton width="60%" />} />
      <Skeleton width={60} />
    </ListItem>
  );

  const CartItemSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <Skeleton variant="rectangular" height={140} />
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Skeleton variant="text" width={60} />
            <Skeleton variant="rounded" width={60} height={24} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
  const current = useSearchParams();
  const currentPage = current.get("current");

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Skeleton width="40%" height={40} sx={{ mb: 3 }} />
        <List disablePadding>
          <SummaryItemSkeleton icon={<ShoppingCartIcon />} />
          <SummaryItemSkeleton icon={<LocalShippingIcon />} />
          <SummaryItemSkeleton icon={<DiscountIcon />} />
          <Divider sx={{ my: 2 }} />
          <ListItem disableGutters>
            <ListItemText
              primary={<Skeleton width="30%" height={32} />}
              secondary={<Skeleton width="50%" />}
            />
            <Skeleton width={80} height={32} />
          </ListItem>
        </List>
      </Paper>

      <Skeleton variant="rounded" height={48} sx={{ mb: 3, width: "100%" }} />

      <Skeleton variant="text" width="40%" height={32} sx={{ mt: 4, mb: 2 }} />
      {!(currentPage === "bag") && (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <CartItemSkeleton key={item} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrderSummarySkeleton;

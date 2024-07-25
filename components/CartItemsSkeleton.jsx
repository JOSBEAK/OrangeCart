import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Skeleton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const CartItemsSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Grid container spacing={2}>
      {[1, 2, 3].map((item) => (
        <Grid item xs={12} key={item}>
          <Card elevation={3} sx={{ display: "flex", mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={isMobile ? 100 : 150}
              height={isMobile ? 100 : 150}
              animation="wave"
            />
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
                <Skeleton
                  animation="wave"
                  height={isMobile ? 20 : 28}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
                <Skeleton
                  animation="wave"
                  height={isMobile ? 16 : 20}
                  width="60%"
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={isMobile ? 1 : 2}
              >
                <Skeleton animation="wave" height={24} width={60} />
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={32}
                  height={32}
                />
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={32}
                  height={32}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CartItemsSkeleton;

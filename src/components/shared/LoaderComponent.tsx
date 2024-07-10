import { FC } from "react";
import { Box, CircularProgress } from "@mui/material";

const LoaderComponent: FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flex={1}
    sx={{ paddingX: "25%", paddingY: { xs: "50%", md: "12%" } }}
  >
    <CircularProgress />
  </Box>
);

export default LoaderComponent;

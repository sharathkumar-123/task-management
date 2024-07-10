import { useMediaQuery, useTheme } from "@mui/material";

export const useMobile = (isSm?: boolean) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(isSm ? 'sm' : 'md'));
  
    return isMobile;
  };
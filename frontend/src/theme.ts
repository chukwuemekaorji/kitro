import { createTheme } from "@mui/material/styles";

// Kitro brand palette (BUILD_SPEC.md §6)
const SWISS_RED = "#E93A37";
const SWISS_RED_LIGHT = "#ED615F";
const LINEN_50 = "#FBF9F4";
const LINEN_300 = "#D3D1C9";
const LINEN_500 = "#85837C";
const WHITE_LOTION = "#FCFCFA";
const BLACK_CHARCOAL = "#323232";

export const theme = createTheme({
  palette: {
    primary: {
      main: SWISS_RED,
      light: SWISS_RED_LIGHT,
    },
    background: {
      default: WHITE_LOTION,
      paper: LINEN_50,
    },
    text: {
      primary: BLACK_CHARCOAL,
      secondary: LINEN_500,
    },
    divider: LINEN_300,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "rgba(233, 58, 55, 0.08)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(233, 58, 55, 0.12)",
          },
          "&.Mui-selected .MuiListItemIcon-root": {
            color: SWISS_RED,
          },
          "&.Mui-selected .MuiListItemText-primary": {
            color: SWISS_RED,
            fontWeight: 600,
          },
        },
      },
    },
  },
});

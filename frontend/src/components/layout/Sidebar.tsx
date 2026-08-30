import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Overview", path: "/overview", icon: <DashboardOutlinedIcon /> },
  { label: "Products", path: "/products", icon: <Inventory2OutlinedIcon /> },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
          Kitro
        </Typography>
      </Toolbar>
      <Box sx={{ px: 1 }}>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={location.pathname.startsWith(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

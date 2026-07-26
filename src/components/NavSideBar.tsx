import Box from '@mui/material/Box';
import {
  Drawer, Icon,
  List,
  ListItem,
  ListItemButton, ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { BackupTable, TipsAndUpdates } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';

const sideBarWidth = 170;

export default function NavSideBar(){
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sideBarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sideBarWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem key="insights" disablePadding>
            <ListItemButton component={RouterLink} to="/">
              <ListItemIcon>
                <Icon component={TipsAndUpdates} />
              </ListItemIcon>
              <ListItemText>Insights</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key="raw-data" disablePadding>
            <ListItemButton component={RouterLink} to="/yourdata">
              <ListItemIcon>
                <Icon component={BackupTable} />
              </ListItemIcon>
              <ListItemText>Your Data</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
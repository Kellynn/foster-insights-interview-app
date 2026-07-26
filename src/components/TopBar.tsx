import Box from '@mui/material/Box';
import { AppBar, Icon, Toolbar, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export default function TopBar(){
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Foster Insights
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Icon component={AccountCircle} />
          <Typography>
            Illinois Department of Children and Family Services
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
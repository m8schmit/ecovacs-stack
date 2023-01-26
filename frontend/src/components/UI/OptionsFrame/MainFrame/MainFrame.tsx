import { NotificationsNone } from '@mui/icons-material';
import { AppBar, Badge, Box, Toolbar, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import { getUnreadNotification } from '../../../../store/menu/menuSlice';
import theme from '../../../../theme';
import Battery from '../../../Battery/Battery';
import DND from '../../../DND/DND';

interface MainFrameProps {
  children?: ReactNode;
}
const MainFrame: FC<MainFrameProps> = ({ children }) => {
  const unReadNotification = getUnreadNotification();
  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="inherit">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" noWrap component="div">
            Ecovacs stack
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={unReadNotification} color="primary" sx={{ marginRight: theme.typography.pxToRem(15) }}>
              <NotificationsNone />
            </Badge>
            <DND />
            <Battery />
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};

export default MainFrame;

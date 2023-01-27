import { NotificationsNone } from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';

import Notifications from '../../../../pages/Notifications/Notifications';
import { useAppDispatch } from '../../../../store/hooks';
import { getNotificationDrawer, setNotificationDrawerIsOpen } from '../../../../store/menu/menuSlice';
import { getUnreadEventsLength } from '../../../../store/vacuum/notificationSlice';
import theme from '../../../../theme';
import { WebSocketContext } from '../../../../utils/socket.utils';
import Battery from '../../../Battery/Battery';
import DND from '../../../DND/DND';
import SecondaryDrawer from '../../Drawer/SecondaryDrawer';

interface MainFrameProps {
  children?: ReactNode;
}
const MainFrame: FC<MainFrameProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isOpen } = getNotificationDrawer();
  const unreadNotification = getUnreadEventsLength();
  const socket = useContext(WebSocketContext);

  const notificationToggle = () => {
    if (!isOpen === false) {
      console.log('clear event');
      socket.emit('setAllBotEventsRead');
    }
    dispatch(setNotificationDrawerIsOpen(!isOpen));
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="inherit">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" noWrap component="div">
            Ecovacs stack
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={notificationToggle} sx={{ marginRight: theme.typography.pxToRem(15) }}>
              <Badge badgeContent={unreadNotification} color="primary">
                <NotificationsNone />
              </Badge>
            </IconButton>
            <DND />
            <Battery />
          </Box>
        </Toolbar>
      </AppBar>
      {children}
      <SecondaryDrawer anchor="right" isOpen={isOpen}>
        <Box sx={{ margin: `0 ${theme.typography.pxToRem(15)}` }}>
          <Notifications />
        </Box>
      </SecondaryDrawer>
    </Box>
  );
};

export default MainFrame;

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import { getNotificationDrawer } from '../../../store/menu/menuSlice';
import theme from '../../../theme';
import useIsSmallScreen from '../../../utils/isSmallScreen.hook';
import useWindowSize from '../../../utils/windowSize.hook';

interface MainProps {
  children: ReactNode;
}

const Main: FC<MainProps> = ({ children }) => {
  const { isOpen, drawerWidth } = getNotificationDrawer();
  const { width: screenWidth } = useWindowSize();
  const isSmallScreen = useIsSmallScreen();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        height: `calc(100vh - ${isSmallScreen ? '128' : '64'}px)`,
        marginTop: '64px',
        position: 'relative',
        marginRight: `-${drawerWidth > screenWidth ? screenWidth : drawerWidth}px`,
        ...(isOpen && {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: 0,
        }),
      }}
    >
      {children}
    </Box>
  );
};

export default Main;

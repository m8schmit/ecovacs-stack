import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { getNotificationDrawer } from '../../../store/menu/menuSlice';
import theme from '../../../theme';

interface MainProps {
  children: ReactNode;
}

const Main: FC<MainProps> = ({ children }) => {
  const { isOpen, drawerWidth } = getNotificationDrawer();

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
        marginRight: `-${drawerWidth}px`,
        height: '100vh',
        marginTop: '64px',
        position: 'relative',
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

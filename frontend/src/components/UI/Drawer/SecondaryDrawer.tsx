import { Drawer, Toolbar } from '@mui/material';
import { FC, ReactNode } from 'react';

import { getNotificationDrawer } from '../../../store/menu/menuSlice';

interface SecondaryDrawerProps {
  children: ReactNode;
  anchor: 'left' | 'top' | 'right' | 'bottom' | undefined;
  isOpen?: boolean;
}

const SecondaryDrawer: FC<SecondaryDrawerProps> = ({ children, anchor, isOpen = true }) => {
  const { drawerWidth } = getNotificationDrawer();

  return (
    <>
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={isOpen}
        sx={{
          maxWidth: drawerWidth,
          width: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            maxWidth: drawerWidth,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'auto',
          },
        }}
      >
        <Toolbar />
        {children}
      </Drawer>
    </>
  );
};

export default SecondaryDrawer;

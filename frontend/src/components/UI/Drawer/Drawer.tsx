import { Drawer as MuiDrawer, Toolbar } from '@mui/material';
import { FC, ReactNode } from 'react';

import { getNotificationDrawer } from '../../../store/menu/menuSlice';

interface DrawerProps {
  children: ReactNode;
  anchor: 'left' | 'top' | 'right' | 'bottom' | undefined;
  isOpen?: boolean;
}

const Drawer: FC<DrawerProps> = ({ children, anchor, isOpen = true }) => {
  const { drawerWidth } = getNotificationDrawer();
  // const [isOpen, setIsOpen] = useState<boolean>(true);

  // const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
  //   if (
  //     event &&
  //     event.type === 'keydown' &&
  //     ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
  //   ) {
  //     return;
  //   }

  //   setIsOpen(open);
  // };

  return (
    <>
      <MuiDrawer
        variant="persistent"
        anchor={anchor}
        open={isOpen}
        // onClose={console.log}
        // onOpen={console.log}
        sx={{
          maxWidth: drawerWidth,
          width: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            maxWidth: drawerWidth,
            width: '100%',
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        {children}
      </MuiDrawer>
    </>
  );
};

export default Drawer;

import { SwipeableDrawer, Toolbar } from '@mui/material';
import { FC, Fragment, ReactNode, useState } from 'react';

interface DrawerProps {
  children: ReactNode;
}

const drawerWidth = 480;

const Drawer: FC<DrawerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsOpen(open);
  };

  return (
    <>
      <Fragment>
        {/* <Button onClick={toggleDrawer(!isOpen)}> toggle</Button> */}
        <SwipeableDrawer
          variant="persistent"
          anchor="left"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          sx={{
            // width: `${isOpen ? drawerWidth : 0}`,
            maxWidth: drawerWidth,
            width: '100%',
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { maxWidth: drawerWidth, width: '100%', boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          {children}
        </SwipeableDrawer>
      </Fragment>
    </>
  );
};

export default Drawer;

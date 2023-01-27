import { Global } from '@emotion/react';
import { Box, SwipeableDrawer, Toolbar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FC, ReactNode, useEffect, useState } from 'react';

import theme from '../../../theme';
import useIsSmallScreen from '../../../utils/isSmallScreen.hook';

interface MainDrawerProps {
  children: ReactNode;
  isOpen?: boolean;
}

const Puller = () => {
  return (
    <Box
      sx={{
        width: 30,
        height: 6,
        backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
      }}
    ></Box>
  );
};

const drawerBleeding = 64;
const drawerWidth = 480;
const MainDrawer: FC<MainDrawerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isSmallScreen = useIsSmallScreen();

  const drawerStyle = {
    maxWidth: drawerWidth,
    width: '100%',
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      maxWidth: drawerWidth,
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'auto',
    },
  };

  // useEffect(() => {
  //   console.log('here', isSmallScreen);
  //   setIsOpen(!isSmallScreen);
  // }, [isSmallScreen]);
  return (
    <>
      {isSmallScreen && (
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(100% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}
        />
      )}
      <SwipeableDrawer
        anchor={isSmallScreen ? 'bottom' : 'left'}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        swipeAreaWidth={isSmallScreen ? drawerBleeding : undefined}
        disableSwipeToOpen={false}
        variant={isSmallScreen ? 'temporary' : 'persistent'}
        sx={!isSmallScreen ? drawerStyle : undefined}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {isSmallScreen && (
          <Box
            sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],

              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
              height: drawerBleeding,
            }}
          >
            <Puller />
          </Box>
        )}
        {!isSmallScreen && <Toolbar />}
        {children}
      </SwipeableDrawer>
    </>
  );
};

export default MainDrawer;

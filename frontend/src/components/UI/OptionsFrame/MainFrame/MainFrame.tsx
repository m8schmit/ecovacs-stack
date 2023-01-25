import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import Battery from '../../../Battery/Battery';
import DND from '../../../DND/DND';

interface MainFrameProps {
  children?: ReactNode;
}
const MainFrame: FC<MainFrameProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="inherit">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Ecovacs stack
          </Typography>
          <Box sx={{ display: 'flex' }}>
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

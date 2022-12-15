import { Box, Divider, Grid, Link, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import theme from '../../../../theme';
import Battery from '../../../Battery/Battery';
import DND from '../../../DND/DND';

interface MainFrameProps {
  children?: ReactNode;
}
const MainFrame: FC<MainFrameProps> = ({ children }) => {
  return (
    <Box sx={{ margin: `0 ${theme.typography.pxToRem(15)}`, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: `${theme.typography.pxToRem(15)} 0` }}>
            <Link href="/" underline="none">
              <Typography variant="h4">Ecovacs stack </Typography>
            </Link>
            <Box sx={{ display: 'flex' }}>
              <DND />
              <Battery />
            </Box>
          </Box>
          <Divider />
        </Grid>
        {children}
      </Grid>
    </Box>
  );
};

export default MainFrame;

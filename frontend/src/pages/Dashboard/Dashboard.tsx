import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Divider, Grid, Tab, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import Battery from '../../components/Battery/Battery';
import DND from '../../components/DND/DND';
import VacuumMap from '../../components/VacuumMap/VacuumMap';
import theme from '../../theme';
import Commands from './Commands/Commands';
import Notifications from './Notifications/Notifications';

const Dashboard = () => {
  const [value, setValue] = useState('2');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ margin: `0 ${theme.typography.pxToRem(15)}`, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: `${theme.typography.pxToRem(15)} 0` }}>
            <Typography variant="h4">Ecovacs stack</Typography>
            <Box sx={{ display: 'flex' }}>
              <DND />
              <Battery />
            </Box>
          </Box>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Notifications" value="1" />
                  <Tab label="Commands" value="2" />
                  <Tab label="Options" value="3" disabled />
                </TabList>
              </Box>
              <TabPanel
                value="1"
                sx={value === '1' ? { display: 'flex', height: 'calc(100vh - 150px)', overflow: 'scroll' } : {}}
              >
                <Notifications />
              </TabPanel>
              <TabPanel
                value="2"
                sx={value === '2' ? { display: 'flex', height: 'calc(100vh - 150px)', overflow: 'scroll' } : {}}
              >
                <Commands />
              </TabPanel>
              <TabPanel
                value="3"
                sx={value === '3' ? { display: 'flex', height: 'calc(100vh - 150px)', overflow: 'scroll' } : {}}
              >
                Item Three
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <VacuumMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

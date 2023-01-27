import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import MainDrawer from '../../components/UI/Drawer/MainDrawer';
import ControlMap from '../../components/VacuumMap/ControlMap';
import { getNotificationDrawer } from '../../store/menu/menuSlice';
import theme from '../../theme';
import Commands from './Commands/Commands';
import Options from './Options/Options';

const Dashboard = () => {
  const [value, setValue] = useState('2');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const drawerWidth = 480;
  const { isOpen } = getNotificationDrawer();

  return (
    <>
      <MainDrawer>
        <Box sx={{ width: '100%', height: '100%', typography: 'body1', overflow: 'hidden' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                sx={{ width: '100%' }}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="lab API tabs example"
              >
                <Tab label="Commands" value="2" />
                <Tab label="Options" value="3" />
                <Tab label="Reports" value="4" disabled />
              </TabList>
            </Box>
            <TabPanel
              value="2"
              sx={value === '2' ? { display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' } : {}}
            >
              <Commands />
            </TabPanel>
            <TabPanel
              value="3"
              sx={value === '3' ? { display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' } : {}}
            >
              <Options />
            </TabPanel>
            <TabPanel
              value="4"
              sx={value === '4' ? { display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' } : {}}
            ></TabPanel>
          </TabContext>
        </Box>
      </MainDrawer>
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
          height: 'calc(100vh - 64px)',
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
        <ControlMap />
      </Box>
    </>
  );
};

export default Dashboard;

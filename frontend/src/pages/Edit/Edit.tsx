import { ArrowBack } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import Drawer from '../../components/UI/Drawer/Drawer';
import EditMap from '../../components/VacuumMap/EditMap';
import { useAppDispatch } from '../../store/hooks';
import { getNotificationDrawer } from '../../store/menu/menuSlice';
import { ActiveToolType, getActiveTool, setActivetool } from '../../store/vacuum/editMapSlice';
import theme from '../../theme';
import MapDelete from './MapDelete/MapDelete';
import { MapSaveTool } from './MapSaveTool/MapSaveTool';
import MergeRoomTool from './MergeRoomTool/MergeRoomTool';
import NoGoZoneTool from './NoGoTool/NoGoTool';
import RenameRoomTool from './RenameRoomTool/RenameRoomTool';
import SplitRoomTool from './SplitRoomTool/SplitRoomTool';

const Edit = () => {
  const activetool = getActiveTool();
  const dispatch = useAppDispatch();

  const handleChange = (tool: ActiveToolType) => dispatch(setActivetool(tool));

  const drawerWidth = 480;
  const { isOpen } = getNotificationDrawer();
  return (
    <>
      <Drawer anchor="left">
        <Box sx={{ width: '100%', height: '100%', typography: 'body1', overflow: 'hidden', p: 2 }}>
          <Box>
            <Link to="/">
              <Button variant="contained" startIcon={<ArrowBack />}>
                Back
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', height: 'calc(100% - 48px)', overflow: 'scroll' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography>What do you want to do?</Typography>

              <Accordion expanded={activetool === 'default'} onChange={() => handleChange('default')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="overline">Rename a room, change his type.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <RenameRoomTool />
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={activetool === 'split'} onChange={() => handleChange('split')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="overline">Split a room in two.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SplitRoomTool />
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={activetool === 'merge'} onChange={() => handleChange('merge')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="overline">Merge two or more adjoining rooms.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <MergeRoomTool />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={
                  activetool === 'noGoTool' ||
                  activetool === 'noGoWall' ||
                  activetool === 'noMopWall' ||
                  activetool === 'noGoZone' ||
                  activetool === 'noMopZone' ||
                  activetool === 'deleteNoGoZone'
                }
                onChange={() => handleChange('noGoTool')}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="overline">Add a noGo or a noMop wall/zone.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <NoGoZoneTool />
                </AccordionDetails>
              </Accordion>

              <Box sx={{ marginTop: 'auto', marginBottom: theme.typography.pxToRem(25) }}>
                <MapSaveTool />
                <MapDelete />
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>

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
        <EditMap />
      </Box>
    </>
  );
};

export default Edit;

import { List, ListItem, Typography } from '@mui/material';
import { getBotSerialInfo } from '../../store/vacuum/stateSlice';
import GlowingDot from '../UI/GlowingDot/GlowingDot';

const BotInfo = () => {
  const info = getBotSerialInfo();
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem>
        <Typography variant="caption">Ready: {info.ready && <GlowingDot />}</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="caption">Bot id: {info.botId}</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="caption">Bot class: {info.botClass}</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="caption">Bot resource: {info.botResource}</Typography>
      </ListItem>
    </List>
  );
};

export default BotInfo;

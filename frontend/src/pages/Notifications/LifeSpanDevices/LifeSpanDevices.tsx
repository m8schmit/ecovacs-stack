import { Box, Button, LinearProgress, List, ListItem, Paper, Typography } from '@mui/material';
import { FC, useContext } from 'react';

import { getLifeSpanDeviceList } from '../../../store/vacuum/notificationSlice';
import { LIFESPAN_LABEL_LIST, LifeSpanDeviceType } from '../../../store/vacuum/notificationSlice.type';
import theme from '../../../theme';
import { WebSocketContext } from '../../../utils/socket.utils';

interface LifeSpanDeviceItemProps {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}

const LifeSpanDeviceItem: FC<LifeSpanDeviceItemProps> = ({ type, left, total }) => {
  const socket = useContext(WebSocketContext);

  const getColor = (percentageValue: number) =>
    percentageValue <= 33 ? 'error' : percentageValue <= 66 ? 'warning' : 'success';

  const getPercentageValue = (partialValue: number, totalValue: number) => ((100 * partialValue) / totalValue) >> 0;

  const percentageValue = getPercentageValue(left, total);
  const hoursLeft = (left / 60) >> 0;
  const color = getColor(percentageValue);

  const handleReset = (type: string) => socket.emit('resetLifeSpan', type);
  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        mb: 1,
        borderRadius: theme.typography.pxToRem(5),
        width: '100%',
      }}
    >
      <ListItem sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 1, flex: '1 1 35%' }} variant="overline">
          {LIFESPAN_LABEL_LIST[type]}
        </Typography>
        <Box sx={{ width: '100%', mr: 1, flex: '1 1 65%' }}>
          <Typography variant="body2" sx={{ color: theme.palette[color].main }}>
            {hoursLeft > 0
              ? `Should be cleaned in ${hoursLeft}hours.`
              : `Should have be cleaned ${hoursLeft * -1}hours ago.`}
          </Typography>

          <LinearProgress color={color} variant="determinate" value={percentageValue || 0} />
        </Box>
        <Button onClick={() => handleReset(type)} disabled={left === total}>
          Reset
        </Button>
      </ListItem>
    </Paper>
  );
};

const LifeSpanDevices = () => {
  const lifeSpanDevicesList = getLifeSpanDeviceList();

  return (
    <List>
      {lifeSpanDevicesList.map((device) => (
        <LifeSpanDeviceItem key={device.type} type={device.type} left={device.left} total={device.total} />
      ))}
    </List>
  );
};

export default LifeSpanDevices;

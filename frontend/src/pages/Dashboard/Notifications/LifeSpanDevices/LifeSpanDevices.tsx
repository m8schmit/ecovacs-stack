import { Box, LinearProgress, List, ListItem, Typography } from '@mui/material';
import { FC } from 'react';

import { getLifeSpanDeviceList } from '../../../../store/vacuum/notificationSlice';
import { LifeSpanDeviceType } from '../../../../store/vacuum/notificationSlice.type';
import { getAutoEmptyState } from '../../../../store/vacuum/stateSlice';
import theme from '../../../../theme';

interface LifeSpanDeviceItemProps {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}

const LifeSpanDeviceItem: FC<LifeSpanDeviceItemProps> = ({ type, left, total }) => {
  const getColor = (percentageValue: number) =>
    percentageValue <= 33 ? 'error' : percentageValue <= 66 ? 'warning' : 'success';

  const getPercentageValue = (partialValue: number, totalValue: number) => ((100 * partialValue) / totalValue) >> 0;

  const percentageValue = getPercentageValue(left, total);
  const hoursLeft = (left / 60) >> 0;
  const color = getColor(percentageValue);

  return (
    <ListItem sx={{ display: 'flex' }}>
      <Typography sx={{ mr: 1, flex: '1 1 15%' }} variant="overline">
        {type}
      </Typography>
      <Box sx={{ width: '100%', mr: 1, flex: '1 1 85%' }}>
        <Typography variant="body2" sx={{ color: theme.palette[color].main }}>
          {hoursLeft > 0
            ? `Should be clean in: ${hoursLeft}hours.`
            : `Should have be cleaned ${hoursLeft * -1}hours ago.`}
        </Typography>

        <LinearProgress color={color} variant="determinate" value={percentageValue || 0} />
      </Box>
    </ListItem>
  );
};

//TODO the state to 5 doesnt seem pesistent.
// Check if thre another way to get this info
const DustBagState = () => {
  const { bagFull } = getAutoEmptyState();

  return (
    <ListItem sx={{ display: 'flex' }}>
      <Typography sx={{ mr: 1, flex: '1 1 15%' }} variant="overline">
        Dust Bag
      </Typography>
      <Typography
        variant="body2"
        sx={{
          width: '100%',
          mr: 1,
          flex: '1 1 85%',
          color: bagFull ? theme.palette.warning.main : theme.palette.success.main,
        }}
      >
        {bagFull ? 'time to change the Dust Bag.' : 'There still place in the Dust Bag.'}
      </Typography>
    </ListItem>
  );
};

// TODO there only the event 1007 maybe implement a DB to keep it.
const MopState = () => {
  return (
    <ListItem sx={{ display: 'flex' }}>
      <Typography sx={{ mr: 1, flex: '1 1 15%' }} variant="overline">
        Mop
      </Typography>
      <Typography
        variant="body2"
        sx={{
          width: '100%',
          mr: 1,
          flex: '1 1 85%',
        }}
      >
        todo
      </Typography>
    </ListItem>
  );
};
const LifeSpanDevices = () => {
  const lifeSpanDevicesList = getLifeSpanDeviceList();

  return (
    <List>
      {lifeSpanDevicesList.map((device) => (
        <LifeSpanDeviceItem key={device.type} type={device.type} left={device.left} total={device.total} />
      ))}
      <DustBagState />
      <MopState />
    </List>
  );
};

export default LifeSpanDevices;

import { Box, LinearProgress, List, ListItem, Typography } from '@mui/material';
import { FC } from 'react';

import { getLifeSpanDeviceList } from '../../../../store/vacuum/notificationSlice';
import { LifeSpanDeviceType } from '../../../../store/vacuum/notificationSlice.type';
import theme from '../../../../theme';

interface LifeSpanDeviceItemProps {
  type: LifeSpanDeviceType;
  left: number;
  total: number;
}
const getPercentageValue = (partialValue: number, totalValue: number) => ((100 * partialValue) / totalValue) >> 0;

const LifeSpanDeviceItem: FC<LifeSpanDeviceItemProps> = ({ type, left, total }) => {
  const percentageValue = getPercentageValue(left, total);
  const hoursLeft = (left / 60) >> 0;
  console.log(percentageValue);
  return (
    <ListItem sx={{ display: 'flex' }}>
      <Typography sx={{ marginRight: theme.typography.pxToRem(15) }}>{type}</Typography>
      <Box sx={{ width: '100%', mr: 1 }}>
        {hoursLeft > 0 ? (
          <Typography>Should be clean in: {hoursLeft}hours</Typography>
        ) : (
          <Typography>Should have be cleaned {hoursLeft * -1}hours ago.</Typography>
        )}
        <LinearProgress variant="determinate" value={percentageValue || 0} />
      </Box>
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
    </List>
  );
};

export default LifeSpanDevices;

import { List, ListItem, Paper, Typography } from '@mui/material';

import { getLifeSpanAccessoryList } from '../../../../store/vacuum/notificationSlice';
import { getMoppingOption } from '../../../../store/vacuum/stateSlice';
import theme from '../../../../theme';

const DustBagState = () => {
  const dustBag = getLifeSpanAccessoryList().find((accessory) => accessory.name === 'dust_bag');

  return (
    <>
      {dustBag && (
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
            <Typography sx={{ mr: 1, flex: '1 1 25%' }} variant="overline">
              Dust Bag
            </Typography>
            <Typography
              variant="body2"
              sx={{
                width: '100%',
                mr: 1,
                flex: '1 1 75%',
                color: dustBag.needToBeChanged ? theme.palette.warning.main : theme.palette.success.main,
              }}
            >
              {dustBag.needToBeChanged ? 'time to change the Dust Bag.' : 'There still place in the Dust Bag.'}
            </Typography>
          </ListItem>
        </Paper>
      )}
    </>
  );
};

const MopState = () => {
  const mop = getLifeSpanAccessoryList().find((accessory) => accessory.name === 'mop');
  const { enable } = getMoppingOption();

  const getTextColor = () => {
    let color = theme.palette.action.disabled;
    if (enable) {
      if (mop?.needToBeChanged) {
        color = theme.palette.warning.main;
      } else {
        color = theme.palette.success.main;
      }
    }
    return color;
  };

  const getLabel = () => {
    let label = 'Mop is not plugged';
    if (enable) {
      if (mop?.needToBeChanged) {
        label = 'Time to change the mop.';
      } else {
        label = 'Mop is still clean.';
      }
    }
    return label;
  };

  return (
    <>
      {mop && (
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
            <Typography sx={{ mr: 1, flex: '1 1 25%' }} variant="overline">
              Mop
            </Typography>
            <Typography
              variant="body2"
              sx={{
                width: '100%',
                mr: 1,
                flex: '1 1 75%',
                color: getTextColor(),
              }}
            >
              {getLabel()}
            </Typography>
          </ListItem>
        </Paper>
      )}
    </>
  );
};

const LifespanAccessories = () => {
  return (
    <List>
      <DustBagState />
      <MopState />
    </List>
  );
};

export default LifespanAccessories;

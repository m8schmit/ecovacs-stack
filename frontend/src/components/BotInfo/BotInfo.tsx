import { InfoRounded } from '@mui/icons-material';
import { Avatar, Badge, Box, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import { Fragment } from 'react';

import { getBotSerialInfo } from '../../store/vacuum/stateSlice';
import theme from '../../theme';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const StyledBadge = styled(Badge)(({ theme, color }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: color,
    color,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const BotInfo = () => {
  const info = getBotSerialInfo();
  return (
    <HtmlTooltip
      title={
        <Fragment>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: theme.typography.pxToRem(11) }}>
              id:&nbsp;
            </Typography>
            <Typography variant="body2" sx={{ fontSize: theme.typography.pxToRem(11) }}>
              {info.botId}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: theme.typography.pxToRem(11) }}>
              class:&nbsp;
            </Typography>
            <Typography variant="body2" sx={{ fontSize: theme.typography.pxToRem(11) }}>
              {info.botClass}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: theme.typography.pxToRem(11) }}>
              resources:&nbsp;
            </Typography>
            <Typography variant="body2" sx={{ fontSize: theme.typography.pxToRem(11) }}>
              {info.botResource}
            </Typography>
          </Box>
        </Fragment>
      }
    >
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={info.ready ? 'success' : 'error'}
      >
        <Avatar>
          <InfoRounded sx={{ color: theme.palette.common.white }} />
        </Avatar>
      </StyledBadge>
    </HtmlTooltip>
  );
};

export default BotInfo;

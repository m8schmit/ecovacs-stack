import { Box } from '@mui/material';
import { FC } from 'react';

import theme from '../../../theme';

interface GlowingDotProps {
  color?: string;
}

const GlowingDot: FC<GlowingDotProps> = ({ color }) => {
  const dotColor = color ? color : theme.palette.primary.main;
  return (
    <Box
      sx={{
        backgroundColor: dotColor,
        color: dotColor,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        width: theme.typography.pxToRem(7),
        height: theme.typography.pxToRem(7),
        borderRadius: '50%',
        position: 'relative',
        '&::after': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: theme.typography.pxToRem(7),
          height: theme.typography.pxToRem(7),
          borderRadius: '50%',
          animation: 'ripple 1.2s infinite ease-in-out',
          border: '1px solid currentColor',
          content: '""',
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
      }}
    ></Box>
  );
};

export default GlowingDot;

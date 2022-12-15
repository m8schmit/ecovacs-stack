import { Box, SxProps, Theme } from '@mui/material';
import { FC, ReactNode } from 'react';

import theme from '../../../theme';

interface OptionsFrameProps {
  sx?: SxProps<Theme> | undefined;

  children: ReactNode;
}

export const OptionsFrame: FC<OptionsFrameProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        ...sx,
        padding: theme.typography.pxToRem(10),
        border: `solid thin ${theme.palette.grey[300]}`,
        borderRadius: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(10),
      }}
    >
      {children}
    </Box>
  );
};

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import theme from '../../../theme';

interface OptionsFrameProps {
  children: ReactNode;
}

export const OptionsFrame: FC<OptionsFrameProps> = ({ children }) => {
  return (
    <Box
      sx={{
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

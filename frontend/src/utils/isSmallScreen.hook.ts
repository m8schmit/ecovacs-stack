import { useEffect, useState } from 'react';
import theme from '../theme';
import useWindowSize from './windowSize.hook';

const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const { width: screenWidth } = useWindowSize();

  useEffect(() => {
    setIsSmallScreen(screenWidth < theme.breakpoints.values['md']);
    return;
  }, [screenWidth]);

  return isSmallScreen;
};

export default useIsSmallScreen;

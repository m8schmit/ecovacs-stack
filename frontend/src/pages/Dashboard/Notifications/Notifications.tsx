import { useContext, useEffect } from 'react';

import { WebSocketContext } from '../../../utils/socket.utils';

export const Notifications = () => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    console.log('getLifeSpan');
    socket.emit('getLifeSpan');
    return;
  }, []);
  return <>HERE</>;
};

export default Notifications;

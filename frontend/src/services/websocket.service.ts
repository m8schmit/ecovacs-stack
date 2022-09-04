import { io } from 'socket.io-client';

const websocketService = () => {
  const socket = io('ws://localhost:3000');

  socket.on('connect', () => {
    console.log('connected! ', socket.id);
  });

  socket.on('disconnect', () => {
    console.log(socket.id);
  });

  return socket;
};

export default websocketService;

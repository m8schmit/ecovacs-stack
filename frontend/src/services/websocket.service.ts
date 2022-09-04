import { io } from 'socket.io-client';

const websocketService = () => {
  const socket = io('ws://localhost:3000');

  socket.on('connect', () => {
    console.log('connected! ', socket.id);
    socket.emit('getMajorMap');
  });

  socket.on('disconnect', () => {
    console.log(socket.id);
  });
  socket.on('vacuumMap', (payload) => {
    console.log('receive vacuumMap', payload);
  });

  return socket;
};

export default websocketService;

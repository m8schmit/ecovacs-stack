import { connect } from 'mqtt';

const client = connect('mqtts://broker:8883', { rejectUnauthorized: false });
// const client = connect('mqtts://192.168.1.170:8883', { rejectUnauthorized: false });
console.info('starting mqtts listener');

client.on('connect', () => {
  console.log('connected');
  client.subscribe('iot/p2p/+/#', (err) => {
    if (!err) {
      console.log('subscribe to [iot/p2p/+/bd802ce4-40c6-4943-b33b-58e5b06881f0/kw9ayx/6Ket/#]');
    }
  });
  client.subscribe('iot/atr/#', (err) => {
    if (!err) {
      console.log('subscribe to [iot/atr/#]');
    }
  });
});

client.on('error', (err) => {
  console.log('error', err);
  //   client.end();
});

client.on('message', (topic, message) => {
  // message is Buffer
  console.log(`[${topic}]`, JSON.parse(message.toString()));
  //   client.end();
});

// import { createServer } from 'https';
// import fs from 'fs';

// const options = {
//   key: fs.readFileSync('/opt/app/src/server.key'),
//   cert: fs.readFileSync('/opt/app/src/server.crt'),
// };

// const requestListener = (req: any, res: any) => {
//   console.log(req, res);
//   res.setHeader('Content-Type', 'text/json');
//   res.writeHead(200);
//   res.end(`{"message": {"success!!"}}`);
// };

// const httpServer = createServer(options, requestListener);

// const host = 'localhost';
// const port = 443;

// httpServer.listen(port, host, () => {
//   console.log(`Server is running on http://${host}:${port}`);
// });

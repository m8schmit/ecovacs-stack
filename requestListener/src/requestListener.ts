import { Client, Server, Subscription } from 'aedes';
import fs from 'fs';
import { createServer } from 'https';

const options = {
  key: fs.readFileSync('/opt/app/src/server.key'),
  cert: fs.readFileSync('/opt/app/src/server.crt'),
};

const requestListener = (req: any, res: any) => {
  console.log(req, res);
  res.setHeader('Content-Type', 'text/json');
  res.writeHead(200);
  res.end(`{"message": {"success!!"}}`);
};

const httpServer = createServer(options, requestListener);

const host = 'localhost';
const HTTPServerPort = 443;

httpServer.listen(HTTPServerPort, host, () => {
  console.log(`Server is running on http://${host}:${HTTPServerPort}`);
});

// BROKER //
const MQTTServerPort = 8883;
const broker = Server();
const server = require('tls').createServer(options, broker.handle);

broker.on('clientError', (client: Client, error: Error) =>
  console.log(
    `MQTT client \x1b[34m${client ? client.id : client}\x1b[0m  receive this error   \x1b[34m${JSON.stringify(
      Error,
    )}\x1b[0m`,
  ),
);

broker.on('subscribe', (subscriptions: Subscription[], client: Client) => {
  console.log(
    `MQTT client \x1b[32m${client ? client.id : client}\x1b[0m subscribed to topics:  \x1b[32m${subscriptions
      .map((s) => s.topic)
      .join('\n')}\x1b[0m, from broker ${broker.id}`,
  );
});

broker.on('client', (client: Client) => {
  console.log(`Client Connected: \x1b[33m${client ? client.id : client}\x1b[0m, to broker ${broker.id}`);
});

server.listen(MQTTServerPort, () => {
  console.log('server started and listening on port ', MQTTServerPort);
});

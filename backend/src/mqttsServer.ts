import { Aedes, Client, Server, Subscription } from 'aedes';

import { options } from './server.utils';

const mqttsServer = (): Promise<Aedes> => {
  return new Promise((resolve, reject) => {
    const port = 8883;
    const broker = Server();
    const server = require('tls').createServer(options, broker.handle);

    broker.on('clientError', (client: Client, error: Error) => {
      console.log(
        `MQTT client \x1b[34m${client ? client.id : client}\x1b[0m  receive this error   \x1b[34m${JSON.stringify(
          error,
        )}\x1b[0m`,
      ),
        reject();
    });

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

    server.listen(port, () => {
      console.log('server started and listening on port ', port);
    });

    resolve(broker);
  });
};

export default mqttsServer;

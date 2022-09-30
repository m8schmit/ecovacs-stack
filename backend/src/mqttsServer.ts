import { Aedes, Client, Server, Subscription } from 'aedes';

import { execShellScript, setTime } from './mqttClient/commands/commands.special';
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
          .join(', ')}\x1b[0m, from broker ${broker.id}`,
      );

      if (client.id === `${process.env.BOTID}@${process.env.BOTCLASS}/${process.env.RESOURCE}`) {
        /* The Helperbot seems to send some information to the bot when it login :
         * setTime, on p2p, otherwise it never trigger the schedules at the right hour
         * 'setting2' on cfg, seems to be some indication of the compatibility with the server and video
         * 'rcpRules' on dtgcfg, some acl information and a lua script in B64
         * 'setting2' on dtgcfg, seems to be some indication of the compatibility with the server and video
         * shell, on p2p, with a script to download a binary file and some assets in B64
         */
        if (subscriptions.filter((s) => s.topic.indexOf('p2p') >= 0).length) {
          setTime();
        }
      }
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

import { MqttClient } from 'mqtt';
import { makeId } from '../text.utils';
import { BotCommand } from './commands.type';

export const getHeader = () => ({
  header: {
    pri: 2,
    tzm: 480,
    ts: Date.now(),
    ver: '0.0.22',
  },
});

export const getJSONFormatedRequestTopic = ({ name }: BotCommand) =>
  `iot/p2p/${name}/HelperBot/x/${makeId(4)}/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/q/x/j`;

export const getFormatedCommand = ({ payload }: BotCommand) =>
  JSON.stringify({ ...{ body: { data: { ...payload } } }, ...getHeader() });

export const sendJSONCommand = (command: BotCommand, client: MqttClient) => {
  const topic = getJSONFormatedRequestTopic(command);
  const message = getFormatedCommand(command);
  client.publish(topic, message, { qos: 0, retain: false }, (err) =>
    err ? console.log('sending err: ', err) : console.log(`${message} correctly sended to [${topic}] !`),
  );
};

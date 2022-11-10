import { MqttClient } from 'mqtt';
import { makeId } from '../text.utils';
import { BotCommand } from './commands.type';

export const getHeader = () => ({
  header: {
    pri: 2 /* server send on pri 2, bot answer on pri 1, dont know yet */,
    // tzm seems to be the negative equivalent of the timezone offset
    tzm: new Date().getTimezoneOffset() * -1,
    ts: Date.now(),
    ver: '0.0.22',
  },
});

export const getJSONFormatedRequestTopic = ({ name }: BotCommand) =>
  `iot/p2p/${name}/HelperBot/x/${makeId(4)}/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/q/x/j`;

export const getFormatedCommand = ({ payload }: BotCommand) =>
  JSON.stringify({ ...{ body: { data: Array.isArray(payload) ? payload : { ...payload } } }, ...getHeader() });

// The 'init' commands are sent without 'header' or 'data' wrapper
export const sendJSONCommand = (command: BotCommand, client: MqttClient, raw: boolean = false) => {
  const topic = getJSONFormatedRequestTopic(command);
  const message = raw ? JSON.stringify(command.payload) : getFormatedCommand(command);
  client.publish(topic, message, { qos: 0, retain: false }, (err) => err && console.log('sending err: ', err));
};

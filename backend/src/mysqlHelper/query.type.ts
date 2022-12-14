import { BotEventType } from '../mqttClient/commands/event.type';

export interface Event {
  id: number;
  evt_code: BotEventType;
  timestamp: string;
}

export interface BotPattern {
  selected: string;
  type: string;
  name: string;
}

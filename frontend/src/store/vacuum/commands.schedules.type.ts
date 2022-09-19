export interface RawSchedules {
  enable: number /* boolean number*/;
  trigger: TriggerType;
  sid: number;
  state: number /* boolean number? */;
  repeat: string /* seven boolean numbers, first is Sunday, last is Saturday */;
  hour: number /* 12 or 24? */;
  minute: number;
  mid: number;
  mapNickName: string;
  index: number;
  content: ScheduleContent;
}

export interface Schedules {
  enable: boolean;
  trigger: TriggerType;
  sid: number;
  state: number /* boolean number? */;
  repeat: string /* seven boolean numbers, first is Sunday, last is Saturday */;
  hour: number /* 12 or 24? */;
  minute: number;
  mid: number;
  mapNickName: string;
  index: number;
  content: {
    name: string;
    jsonStr: any;
  };
}

type SchedNameType = 'clean' | 'plan';

type TriggerType = 'app';

interface ScheduleContent {
  name: SchedNameType;
  jsonStr: string;
}

// jsonStr Will look like {\"router\":\"plan\",\"content\":{\"type\":\"spotArea\",\"value\":\"5\",\"subtype\":\"0\",\"areaName\":\"\"}} for a spotArea cleaning
// or {"router":"plan","content":{"type":"auto"} for an auto cleaning

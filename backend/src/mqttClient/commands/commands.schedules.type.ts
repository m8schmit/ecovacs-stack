export interface Schedules {
  enable: number /* boolean number*/;
  trigger: TriggerType;
  sid: number;
  state: number /* boolean number? */;
  repeat: number /* seven boolean numbers, first is Sunday, last is Saturday */;
  hour: number /* 12 or 24? */;
  minute: number;
  mid: number;
  mapNickName: string;
  index: number;
  content: ScheduleContent;
}

type SchedNameType = 'clean' | 'plan';

type TriggerType = 'app';

export type CleaningType = 'auto' | 'spotArea';

interface ScheduleContent {
  name: SchedNameType;
  jsonStr: string;
}

// jsonStr Will look like {\"router\":\"plan\",\"content\":{\"type\":\"spotArea\",\"value\":\"5\",\"subtype\":\"0\",\"areaName\":\"\"}} for a spotArea cleaning
// or {"router":"plan","content":{"type":"auto"} for an auto cleaning

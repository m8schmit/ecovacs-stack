type BotEventId = 1007 | 1015 | 1021 | 1052 | 1053 | 1071 | 1061 | 1062 | 1068 | 1088;

type BotEventType = 'ERROR' | 'EVENT';

const RELOCATE_SUCCESS_EVENT: BotEventId = 1071;
const RELOCATE_FAILED_EVENT: BotEventId = 1088;
const RELOCATE_FAILED_RETURN_TO_CHARGE_EVENT: BotEventId = 1068;
const MOP_INSTALLED_EVENT: BotEventId = 1007;
const CHANGE_MOP_REMINDER_EVENT: BotEventId = 1052;
const OBSTACLE: BotEventId = 1053;
const UNABLE_TO_LOCATE_STARTING_NEW_MAP_EVENT: BotEventId = 1062;
const RESUMING_CLEANING_AFTER_POSITION_RETRIEVED_EVENT: BotEventId = 1061;

export {
  BotEventId,
  BotEventType,
  RELOCATE_SUCCESS_EVENT,
  RELOCATE_FAILED_RETURN_TO_CHARGE_EVENT,
  MOP_INSTALLED_EVENT,
  CHANGE_MOP_REMINDER_EVENT,
  RELOCATE_FAILED_EVENT,
  OBSTACLE,
  UNABLE_TO_LOCATE_STARTING_NEW_MAP_EVENT,
  RESUMING_CLEANING_AFTER_POSITION_RETRIEVED_EVENT,
};

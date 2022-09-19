import dayjs from 'dayjs';

export interface DaysList {
  value: string;
  label: string;
}

export interface ScheduleFormData {
  startAt: dayjs.Dayjs;
  once: boolean;
  days: string[];
  auto: boolean;
  rooms: string[];
}

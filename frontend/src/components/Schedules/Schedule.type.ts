import { Dayjs } from 'dayjs';

export interface DaysList {
  value: string;
  label: string;
}

export interface ScheduleFormData {
  startAt: Dayjs;
  once: boolean;
  days: string[];
  auto: boolean;
  rooms: string[];
}

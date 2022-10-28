import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import { BotEvent, LifeSpanDevice } from './notificationSlice.type';

interface NotificationState {
  lifeSpanDeviceList: LifeSpanDevice[];
  eventsList: BotEvent[];
}

const initialState: NotificationState = { lifeSpanDeviceList: [], eventsList: [] };

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLifeSpanDeviceList: (state, action: PayloadAction<LifeSpanDevice[]>) => ({
      ...state,
      lifeSpanDeviceList: action.payload,
    }),
    setEventsList: (state, action: PayloadAction<BotEvent[]>) => ({
      ...state,
      eventsList: action.payload,
    }),
  },
});

export const { setLifeSpanDeviceList, setEventsList } = notificationSlice.actions;

export const getLifeSpanDeviceList = () => useAppSelector(({ notification }) => notification.lifeSpanDeviceList);
export const getEventsList = () => useAppSelector(({ notification }) => notification.eventsList);

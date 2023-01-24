import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import { BotNotification, LifespanAccessory, LifeSpanDevice } from './notificationSlice.type';

interface NotificationState {
  lifeSpanDeviceList: LifeSpanDevice[];
  lifeSpanAccessoryList: LifespanAccessory[];
  eventsList: BotNotification[];
}

const initialState: NotificationState = {
  lifeSpanDeviceList: [],
  lifeSpanAccessoryList: [],
  eventsList: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLifeSpanDeviceList: (state, action: PayloadAction<LifeSpanDevice[]>) => ({
      ...state,
      lifeSpanDeviceList: action.payload,
    }),
    setEventsList: (state, action: PayloadAction<BotNotification[]>) => ({
      ...state,
      eventsList: action.payload,
    }),
    setLifeSpanAccessory: (state, action: PayloadAction<LifespanAccessory[]>) => ({
      ...state,
      lifeSpanAccessoryList: action.payload.reduce(
        (acc: LifespanAccessory[], curr) => {
          const duplicateIndex = acc.findIndex((Accessory) => Accessory.name === curr.name);
          if (duplicateIndex !== -1) {
            acc.slice(duplicateIndex);
          }
          return [...acc, curr];
        },
        [...state.lifeSpanAccessoryList],
      ),
    }),
  },
});

export const { setLifeSpanDeviceList, setEventsList, setLifeSpanAccessory } = notificationSlice.actions;

export const getLifeSpanDeviceList = () => useAppSelector(({ notification }) => notification.lifeSpanDeviceList);
export const getLifeSpanAccessoryList = () => useAppSelector(({ notification }) => notification.lifeSpanAccessoryList);
export const getEventsList = () => useAppSelector(({ notification }) => notification.eventsList);

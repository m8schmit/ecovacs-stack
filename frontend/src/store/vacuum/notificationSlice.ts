import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import {
  BotErrorType,
  BotEventType,
  BotNotification,
  LifeSpanDevice,
  LifespanAccessory,
} from './notificationSlice.type';

interface NotificationState {
  lifeSpanDeviceList: LifeSpanDevice[];
  lifeSpanAccessoryList: LifespanAccessory[];
  eventsList: BotNotification<BotEventType>[];
  errorsList: BotNotification<BotErrorType>[];
}

const initialState: NotificationState = {
  lifeSpanDeviceList: [],
  lifeSpanAccessoryList: [],
  eventsList: [],
  errorsList: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLifeSpanDeviceList: (state, action: PayloadAction<LifeSpanDevice[]>) => ({
      ...state,
      lifeSpanDeviceList: action.payload,
    }),
    setEventsList: (state, action: PayloadAction<BotNotification<BotEventType>[]>) => ({
      ...state,
      eventsList: action.payload,
    }),
    setErrorsList: (state, action: PayloadAction<BotNotification<BotErrorType>[]>) => ({
      ...state,
      errorsList: action.payload,
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

export const { setLifeSpanDeviceList, setEventsList, setErrorsList, setLifeSpanAccessory } = notificationSlice.actions;

export const getLifeSpanDeviceList = () => useAppSelector(({ notification }) => notification.lifeSpanDeviceList);
export const getLifeSpanAccessoryList = () => useAppSelector(({ notification }) => notification.lifeSpanAccessoryList);
export const getEventsList = () => useAppSelector(({ notification }) => notification.eventsList);
export const getErrorsList = () => useAppSelector(({ notification }) => notification.errorsList);

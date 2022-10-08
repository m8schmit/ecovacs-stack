import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

import { LifeSpanDevice } from './notificationSlice.type';

interface NotificationState {
  lifeSpanDeviceList: LifeSpanDevice[];
}

const initialState: NotificationState = { lifeSpanDeviceList: [] };

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLifeSpanDeviceList: (state, action: PayloadAction<LifeSpanDevice[]>) => ({
      ...state,
      lifeSpanDeviceList: action.payload,
    }),
  },
});

export const { setLifeSpanDeviceList } = notificationSlice.actions;

export const getLifeSpanDeviceList = () => useAppSelector(({ notification }) => notification.lifeSpanDeviceList);

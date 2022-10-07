import { LifeSpanDevice } from './notificationSlice.type';

interface NotificationState {
  lifeSpanDeviceList: LifeSpanDevice[];
}

const initialState: NotificationState = { lifeSpanDeviceList: [] };

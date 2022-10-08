import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { dialogSlice } from './dialog/dialogSlice';
import { mapSlice } from './vacuum/mapSlice';
import { notificationSlice } from './vacuum/notificationSlice';
import { stateSlice } from './vacuum/stateSlice';

const rootReducer = combineReducers({
  state: stateSlice.reducer,
  map: mapSlice.reducer,
  dialog: dialogSlice.reducer,
  notification: notificationSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(),
  // prepend and concat calls can be chained
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export default store;

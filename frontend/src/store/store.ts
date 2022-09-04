import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { VacuumSlice } from './vacuum/vacuumSlice';

const rootReducer = combineReducers({
  vacuum: VacuumSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(),
  // prepend and concat calls can be chained
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];

export default store;

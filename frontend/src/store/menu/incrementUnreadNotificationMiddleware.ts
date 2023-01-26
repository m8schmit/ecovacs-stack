import { AnyAction, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { addUnreadNotification } from './menuSlice';

export const incrementUnreadNotificationMiddleware: Middleware =
  (store: MiddlewareAPI) => (next) => (action: AnyAction) => {
    if (action.type.search('setEventsList') !== -1 && store.getState().notification.eventsList.length) {
      store.dispatch(addUnreadNotification());
    }

    return next(action);
  };

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

interface MenuState {
  mainDrawer: {
    isOpen: boolean;
  };
  notificationDrawer: {
    isOpen: boolean;
    unreadNotification: number;
  };
}

const initialState: MenuState = {
  mainDrawer: {
    isOpen: true,
  },
  notificationDrawer: {
    isOpen: false,
    unreadNotification: 0,
  },
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMainDrawerIsOpen: (state, action: PayloadAction<boolean>) => ({
      ...state,
      mainDrawer: {
        ...state.mainDrawer,
        isOpen: action.payload,
      },
    }),
    setNotificationDrawerIsOpen: (state, action: PayloadAction<boolean>) => ({
      ...state,
      notificationDrawer: {
        ...state.notificationDrawer,
        isOpen: action.payload,
      },
    }),
    addUnreadNotification: (state) => ({
      ...state,
      notificationDrawer: {
        ...state.notificationDrawer,
        unreadNotification: state.notificationDrawer.unreadNotification + 1,
      },
    }),
    resetUnreadNotification: (state) => ({
      ...state,
      notificationDrawer: {
        ...state.notificationDrawer,
        unreadNotification: initialState.notificationDrawer.unreadNotification,
      },
    }),
  },
});

export const { setMainDrawerIsOpen, setNotificationDrawerIsOpen, addUnreadNotification, resetUnreadNotification } =
  menuSlice.actions;

export const getMainDrawerIsOpen = () => useAppSelector(({ menu }) => menu.mainDrawer.isOpen);
export const getNotificationDrawerIsOpen = () => useAppSelector(({ menu }) => menu.notificationDrawer.isOpen);
export const getUnreadNotification = () => useAppSelector(({ menu }) => menu.notificationDrawer.unreadNotification);

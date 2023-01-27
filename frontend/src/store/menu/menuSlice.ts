import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

interface MenuState {
  notificationDrawer: {
    isOpen: boolean;
    drawerWidth: number;
  };
}

const initialState: MenuState = {
  notificationDrawer: {
    isOpen: false,
    drawerWidth: 480,
  },
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setNotificationDrawerIsOpen: (state, action: PayloadAction<boolean>) => ({
      ...state,
      notificationDrawer: {
        ...state.notificationDrawer,
        isOpen: action.payload,
      },
    }),
  },
});

export const { setNotificationDrawerIsOpen } = menuSlice.actions;

export const getNotificationDrawer = () => useAppSelector(({ menu }) => menu.notificationDrawer);

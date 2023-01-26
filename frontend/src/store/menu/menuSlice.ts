import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

interface MenuState {
  mainDrawer: {
    isOpen: boolean;
    drawerWidth: number;
  };
  notificationDrawer: {
    isOpen: boolean;
    drawerWidth: number;
  };
}

const initialState: MenuState = {
  mainDrawer: {
    isOpen: true,
    drawerWidth: 480,
  },
  notificationDrawer: {
    isOpen: false,
    drawerWidth: 480,
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
  },
});

export const { setMainDrawerIsOpen, setNotificationDrawerIsOpen } = menuSlice.actions;

export const getMainDrawer = () => useAppSelector(({ menu }) => menu.mainDrawer);
export const getNotificationDrawer = () => useAppSelector(({ menu }) => menu.notificationDrawer);

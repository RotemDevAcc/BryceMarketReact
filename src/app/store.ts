import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from '../components/login/loginSlice';
import darkModeReducer from '../components/settings/darkModeSlice';
import cartReducer from '../components/supermarket/cartSlice';
import superReducer from '../components/supermarket/superSlice';
import registerReducer from '../components/login/registerSlice';
import managementReducer from '../components/management/managementSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    darkMode: darkModeReducer,
    cart: cartReducer,
    super: superReducer,
    register: registerReducer,
    management: managementReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

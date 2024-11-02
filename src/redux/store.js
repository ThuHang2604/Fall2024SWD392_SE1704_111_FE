import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slice/authSlice';
import userProfileReducer from './slice/userProfileSlice';
import bookingReducer from './slice/userBooking';
import voucherReducer from './slice/voucherSlice';
import hairServiceReducer from './slice/hairServiceSlice';
import feedbackReducer from './slice/feedbackSlice';
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['auth', 'userProfile', 'voucher', 'feedback'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  booking: bookingReducer,
  voucher: voucherReducer,
  hairService: hairServiceReducer,
  feedBack: feedbackReducer,
});

const persistedAuthReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedAuthReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: true,
    }),
});

export default store;

export const persistor = persistStore(store);

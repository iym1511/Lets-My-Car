import { Store } from "@reduxjs/toolkit";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import resentReducer from './module/ResentSearch';

// redux-parsist
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage"; // 로컬 스토리지
import storageSession from "redux-persist/lib/storage/session"; // 세션 스토리지

const rootReducer = combineReducers({
  resent : resentReducer,
});

const persistConfig: any = {
  key : 'root',
  storage,
  list: ['resent']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

// state와 dispatch 타입지정
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store
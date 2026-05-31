import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { teamgmApi } from '@/store/api';
import { scoresReducer } from '@/store/slices/scores-slice';

export const store = configureStore({
  reducer: {
    scores: scoresReducer,
    [teamgmApi.reducerPath]: teamgmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(teamgmApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from './services/auth';
import { agentApi } from './services/auth';
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, agentApi.middleware), 
})

setupListeners(store.dispatch);



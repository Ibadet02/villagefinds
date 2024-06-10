import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import loadingReducer from '@/redux/reducers/loader';
import guestReducer from '@/redux/reducers/guest';
import subscriptionReducer from '@/redux/reducers/subscription';
import productReducer from '@/redux/reducers/product';
import metricReducer from '@/redux/reducers/metric';

export const store = configureStore({
  reducer: {
    guest: guestReducer,
    loader: loadingReducer,
    subscription: subscriptionReducer,
    product: productReducer,
    metric: metricReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

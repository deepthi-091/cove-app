import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { cartReducer } from './cart/cartReducer';
import productReducer from './products/productSlice';
import { rootSaga } from './sagas/rootSaga';

const sagaMiddleware = (createSagaMiddleware as any)();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

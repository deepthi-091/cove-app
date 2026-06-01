import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { cartReducer } from './cart/cartReducer';
import productReducer from './products/productSlice';
import { rootSaga } from './sagas/rootSaga';
import { storage } from '@/utils/storage';
import { sqliteCart } from '@/lib/sqlite';

const createSagaMiddleware = require('redux-saga').default;
const sagaMiddleware = createSagaMiddleware();

// Persist cart to AsyncStorage + SQLite on every change
const cartPersistMiddleware: Middleware = storeAPI => next => action => {
  const result = next(action);
  const actionType = (action as any).type as string;

  if (actionType?.startsWith('cart/') || ['ADD_TO_CART', 'REMOVE_FROM_CART', 'UPDATE_QUANTITY', 'CLEAR_CART'].includes(actionType)) {
    const { items } = storeAPI.getState().cart;
    // AsyncStorage — lightweight, fast
    storage.setCart(items).catch(console.error);
    // SQLite — for large datasets
    sqliteCart.saveAll(items).catch(console.error);
  }

  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(sagaMiddleware, cartPersistMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Rehydrate cart from AsyncStorage on startup
export async function rehydrateCart() {
  try {
    const cartItems = await storage.getCart();
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item: any) => {
        store.dispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }
  } catch (error) {
    console.error('Error rehydrating cart:', error);
  }
}

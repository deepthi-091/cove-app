import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART } from './cartActionTypes';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

export interface AddToCartAction {
  type: typeof ADD_TO_CART;
  payload: CartItem;
}

export interface RemoveFromCartAction {
  type: typeof REMOVE_FROM_CART;
  payload: { id: string };
}

export interface UpdateQuantityAction {
  type: typeof UPDATE_QUANTITY;
  payload: { id: string; quantity: number };
}

export interface ClearCartAction {
  type: typeof CLEAR_CART;
}

export type CartAction =
  | AddToCartAction
  | RemoveFromCartAction
  | UpdateQuantityAction
  | ClearCartAction;

export const addToCart = (item: CartItem): AddToCartAction => ({
  type: ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (id: string): RemoveFromCartAction => ({
  type: REMOVE_FROM_CART,
  payload: { id },
});

export const updateQuantity = (id: string, quantity: number): UpdateQuantityAction => ({
  type: UPDATE_QUANTITY,
  payload: { id, quantity },
});

export const clearCart = (): ClearCartAction => ({
  type: CLEAR_CART,
});

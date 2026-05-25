import type { UnknownAction } from 'redux';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART } from './cartActionTypes';
import type { CartAction, CartItem, AddToCartAction, RemoveFromCartAction, UpdateQuantityAction } from './cartActions';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

export const cartReducer = (state: CartState = initialState, action: UnknownAction | CartAction): CartState => {
  switch (action.type) {
    case ADD_TO_CART: {
      const typedAction = action as AddToCartAction;
      const existingItem = state.items.find(item => item.id === typedAction.payload.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === typedAction.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, typedAction.payload];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    }

    case REMOVE_FROM_CART: {
      const typedAction = action as RemoveFromCartAction;
      const newItems = state.items.filter(item => item.id !== typedAction.payload.id);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    }

    case UPDATE_QUANTITY: {
      const typedAction = action as UpdateQuantityAction;
      const { id, quantity } = typedAction.payload;

      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== id);
        const { totalItems, totalPrice } = calculateTotals(newItems);
        return { items: newItems, totalItems, totalPrice };
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    }

    case CLEAR_CART: {
      return initialState;
    }

    default:
      return state;
  }
};

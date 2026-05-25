import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { Dispatch } from 'redux';
import type { RootState, AppDispatch } from './store';
import type { CartAction } from './cart/cartActions';
import type { FetchProductsRequestAction, FetchProductByIdRequestAction } from './products/productSagaActions';

// Extended dispatch that accepts both RTK actions and manual Redux actions
type ExtendedDispatch = AppDispatch & ((action: CartAction | FetchProductsRequestAction | FetchProductByIdRequestAction) => any);

export const useAppDispatch = () => useDispatch() as ExtendedDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

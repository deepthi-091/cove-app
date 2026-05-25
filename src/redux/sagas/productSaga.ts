import { call, put, takeLatest } from 'redux-saga/effects';
import type { Product } from '@/types';
import { api } from '@/utils/api';
import { setProducts, setSelectedProduct, setLoading, setError } from '../products/productSlice';
import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCT_BY_ID_REQUEST, FetchProductsRequestAction, FetchProductByIdRequestAction } from '../products/productSagaActions';

function* fetchProductsSaga(action: FetchProductsRequestAction) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const { category, search } = action.payload ?? {};
    let products: Product[];

    if (search) {
      products = (yield call([api, api.searchProducts], search)) as Product[];
    } else if (category && category !== '1') {
      products = (yield call([api, api.getProductsByCategory], category)) as Product[];
    } else {
      products = (yield call([api, api.getProducts])) as Product[];
    }

    yield put(setProducts(products));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to load products'));
  } finally {
    yield put(setLoading(false));
  }
}

function* fetchProductByIdSaga(action: FetchProductByIdRequestAction) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const product = (yield call([api, api.getProductById], action.payload)) as Product | undefined;
    yield put(setSelectedProduct(product ?? null));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to load product'));
  } finally {
    yield put(setLoading(false));
  }
}

export function* watchProductSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(FETCH_PRODUCT_BY_ID_REQUEST, fetchProductByIdSaga);
}

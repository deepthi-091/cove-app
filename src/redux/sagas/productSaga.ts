import { call, put, takeLatest } from 'redux-saga/effects';
import type { Product } from '@/types';
import { fetchProducts, fetchProductById, searchProducts, fetchByCategory, fetchCategories } from '@/api/products/productsApi';
import { setProducts, setSelectedProduct, setCategories, setLoading, setError } from '../products/productSlice';
import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCT_BY_ID_REQUEST, FetchProductsRequestAction, FetchProductByIdRequestAction } from '../products/productSagaActions';

function* fetchProductsSaga(action: FetchProductsRequestAction) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const { category, search } = action.payload ?? {};
    let response;

    if (search) {
      response = yield call(searchProducts, search);
    } else if (category && category !== 'all') {
      response = yield call(fetchByCategory, category);
    } else {
      response = yield call(fetchProducts);
    }

    if (response.success && response.data) {
      yield put(setProducts(response.data));
    } else {
      yield put(setError(response.message || 'Failed to load products'));
    }
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

    const response = yield call(fetchProductById, action.payload);
    if (response.success && response.data) {
      yield put(setSelectedProduct(response.data));
    } else {
      yield put(setError(response.message || 'Failed to load product'));
    }
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to load product'));
  } finally {
    yield put(setLoading(false));
  }
}

function* fetchCategoriesSaga() {
  try {
    const response = yield call(fetchCategories);
    if (response.success && response.data) {
      yield put(setCategories(response.data));
    }
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
  }
}

export function* watchProductSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(FETCH_PRODUCT_BY_ID_REQUEST, fetchProductByIdSaga);
}

export function* initializeCategoriesSaga() {
  yield call(fetchCategoriesSaga);
}

import { all } from 'redux-saga/effects';
import { watchProductSaga } from './productSaga';

export function* rootSaga() {
  yield all([watchProductSaga()]);
}

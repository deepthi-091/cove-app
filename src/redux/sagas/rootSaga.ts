import { all, fork } from 'redux-saga/effects';
import { watchProductSaga, initializeCategoriesSaga } from './productSaga';

export function* rootSaga() {
  yield all([
    fork(watchProductSaga),
    fork(initializeCategoriesSaga),
  ]);
}

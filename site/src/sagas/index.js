import { fork } from 'redux-saga/effects'

/* ------------- Sagas ------------- */
import RootSaga from './RootSaga'

/* ------------- Services ------------- */

export default function* root() {
  yield [
    fork(RootSaga),
  ]
}

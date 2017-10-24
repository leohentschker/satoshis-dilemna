import { fork } from 'redux-saga/effects'

/* ------------- Sagas ------------- */
import ChatSaga from './ChatSaga'
import GameSaga from './GameSaga'

/* ------------- Services ------------- */

export default function* root() {
  yield [
    fork(GameSaga),
  ]
}

// external
import {
  takeEvery,
  call,
  put,
} from 'redux-saga/effects'
import IPFS from 'ipfs'


// internal
import GameActions, { GameTypes } from '../redux/game'
import chatFlow from './ChatSaga'


const launchIPFS = async () => {
  const node = new IPFS({
    EXPERIMENTAL: {
      pubsub: true,
    },
  })
  return new Promise(resolve => node.on('ready', () => resolve(node)))
}

function findGame(level) {
  return `asd123${level}`
}

function* joinGame(ipfs, { level }) {
  const gameID = yield call(findGame, level)

  yield put(GameActions.joinGame(gameID))

  const chat = yield call(chatFlow, ipfs, gameID)
}

export default function* flow() {
  const ipfs = yield call(launchIPFS)
  yield [
    takeEvery(GameTypes.FIND_GAME, joinGame, ipfs),
  ]
}

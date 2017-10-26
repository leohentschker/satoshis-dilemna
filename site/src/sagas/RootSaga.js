// external
import {
  takeEvery,
  race,
  call,
  put,
} from 'redux-saga/effects'
import IPFS from 'ipfs'

// internal
import GameActions, { GameTypes } from '../redux/game'
import matchmakingFlow from './MatchmakingSaga'
import eavesdropFlow from './EavesdropSaga'
import chatFlow from './ChatSaga'
import gameFlow from './GameSaga'


const launchIPFS = async () => {
  const node = new IPFS({
    EXPERIMENTAL: {
      pubsub: true,
    },
  })
  return new Promise(resolve => node.on('ready', () => resolve(node)))
}

function* findGame(ipfs, { level }) {
  const gameRoom = yield call(matchmakingFlow, ipfs, level)
  const ipfsUser = yield call(ipfs.id)

  yield put(GameActions.setId(ipfsUser.id))

  yield race({
    subscribe: call(eavesdropFlow, gameRoom),
    chat: call(chatFlow, ipfsUser.id, gameRoom),
    game: call(gameFlow, ipfsUser.id, gameRoom),
  })
}

export default function* flow() {
  const ipfs = yield call(launchIPFS)

  yield [
    takeEvery(GameTypes.FIND_GAME, findGame, ipfs),
  ]
}

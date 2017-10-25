// external
import {
  takeEvery,
  take,
  race,
  call,
  put,
} from 'redux-saga/effects'
import Room from 'ipfs-pubsub-room'
import IPFS from 'ipfs'

// internal
import GameActions, { GameTypes } from '../redux/game'
import matchmakingFlow from './MatchmakingSaga'
import chatFlow from './ChatSaga'


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
  console.log(gameRoom, 'THE ROOM WE JOINED')
  yield race({
    chat: call(chatFlow, ipfs, gameRoom),
    // game: call(gameFlow, gameRoom),
  })
}

export default function* flow() {
  const ipfs = yield call(launchIPFS)
  yield [
    takeEvery(GameTypes.FIND_GAME, findGame, ipfs),
    // takeEvery(GameTypes.JOIN_GAME, joinGame, ipfs),
  ]
}

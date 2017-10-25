// external
import {
  takeEvery,
  cancel,
  take,
  race,
  call,
  put,
} from 'redux-saga/effects'
import {
  eventChannel,
  delay,
} from 'redux-saga'
import Room from 'ipfs-pubsub-room'
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

function* propositionRoom(room) {
  // how long we wait in between propositions
  const PROPOSITION_DELAY = 1000

  const peers = room.getPeers()
  if (peers.length) {
    const selectedPeer = peers[Math.floor(Math.random() * peers.length)]
    room.sendTo(selectedPeer, 'asd12344')
  }

  // wait to proposition again
  yield call(delay, PROPOSITION_DELAY, true)

  yield call(propositionRoom, room)
}

function* acceptInvitations(room) {
  const roomChannel = eventChannel((emit) => {
    // get the most recent messages from the channel
    room.on('message', (msg) => {
      const roomID = msg.data.toString()
      room.sendTo(msg.from, roomID)
      emit(GameActions.joinGame(roomID))
    })

    // unsubscribe functions
    return () => room.leave()
  })
  while (true) {
    const action = yield take(roomChannel)
    yield put(action)
  }
}

function* findGame(ipfs, { level }) {
  const room = Room(ipfs, `satoshis-dilemna-${level}`)
  console.log('lev', level)

  yield race({
    task1: call(acceptInvitations, room),
    task2: call(propositionRoom, room),
    cancel: take(GameTypes.JOIN_GAME),
  })
}

function* joinGame(ipfs, { gameID }) {
  const chat = yield call(chatFlow, ipfs, gameID)
}

export default function* flow() {
  const ipfs = yield call(launchIPFS)
  const id = yield ipfs.id()
  console.log(id)
  yield [
    takeEvery(GameTypes.FIND_GAME, findGame, ipfs),
    takeEvery(GameTypes.JOIN_GAME, joinGame, ipfs),
  ]
}

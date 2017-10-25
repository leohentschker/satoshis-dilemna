// external
import {
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

// internal
import GameActions, { GameTypes } from '../redux/game'

// how long we wait in between propositions
const PROPOSITION_DELAY = 1000

const randomElt = arr =>
  arr[Math.floor(Math.random() * arr.length)]

const randomString = () =>
  Math.random().toString(36).slice(2)

function* propositionRoom(room) {
  // get the peers in the room
  const peers = room.getPeers()

  // proposition a random peer
  if (peers.length) {
    const selectedPeer = randomElt(peers)
    room.sendTo(selectedPeer, randomString())
  }

  // wait to proposition again
  yield call(delay, PROPOSITION_DELAY, true)
  yield call(propositionRoom, room)
}

function* acceptInvitations(room) {
  const roomChannel = eventChannel((emit) => {
    // get the most recent messages from the channel
    room.on('message', (msg) => {
      const gameID = msg.data.toString()

      // send a message back saying we're interested
      room.sendTo(msg.from, gameID)
      emit(GameActions.testGame(gameID, msg.from))
    })

    // unsubscribe functions
    return () => room.leave()
  })

  const action = yield take(roomChannel)
  yield put(action)
}

function* testConnection(room, gameID, peerID) {
  // if our peer is already in the room
  if (room.hasPeer(peerID)) {
    yield put(GameActions.joinGame(room))
  }

  // wait for the peer to join
  const roomChannel = eventChannel((emit) => {
    // get the most recent messages from the channel
    room.on('peer joined', () => {
      emit(GameActions.joinGame(room))
    })

    // unsubscribe functions
    return () => room.leave()
  })

  const action = yield take(roomChannel)
  yield put(action)
}

function* findPotentialGames(ipfs, room) {
  // send invites and accept invites until we get
  // an acceptable partner
  console.log('looking for potential')
  const { result } = yield race({
    acceptInvites: call(acceptInvitations, room),
    makePropositions: call(propositionRoom, room),
    result: take(GameTypes.TEST_GAME),
  })
  const { gameID, peerID } = result

  // make sure that the other person also
  // joins the room
  const gameRoom = Room(ipfs, gameID)
  yield race({
    attemptToJoin: call(testConnection, gameRoom, peerID),
    delay: call(delay, PROPOSITION_DELAY * 2, true),
  })

  yield call(findPotentialGames, ipfs, room)
}

export default function* matchmakingFlow(ipfs, level) {
  // join the matchmaking room
  const lobbyRoom = Room(ipfs, `satoshis-dilemna-${level}`)

  // find a peer and set up a game
  const { joinGame } = yield race({
    findGames: call(findPotentialGames, ipfs, lobbyRoom),
    joinGame: take(GameTypes.JOIN_GAME),
  })
  const { gameRoom } = joinGame

  return gameRoom
}

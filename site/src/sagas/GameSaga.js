// external
import cryptoRandomString from 'crypto-random-string'
import {
  select,
  take,
  call,
  put,
} from 'redux-saga/effects'

// internal
import GameActions, { GameTypes } from '../redux/game'

const hash = (a, b) => a + b


function* handleInput(ipfsID, gameRoom, secret) {
  const { action } = yield take(GameTypes.SUBMIT_ACTION)
  const actionHash = hash(secret, action)

  // broadcast our action to our opponent
  gameRoom.broadcast(JSON.stringify(
    GameActions.broadcastAction(
      ipfsID, actionHash),
  ))
}

function* handleAction(ipfsID, { userID, actionHash }) {
  if (userID !== ipfsID) {
    yield put(GameActions.setOpponentHash(actionHash))
  }
}

function* listenForActions(ipfsID) {
  yield take(GameTypes.BROADCAST_ACTION, handleAction, ipfsID)
  yield take(GameTypes.BROADCAST_ACTION, handleAction, ipfsID)
}

function* reveal(gameRoom, ipfsID, secret) {
  const userAction = yield select(state => state.game.userAction)
  console.log(userAction, 'user action')
  gameRoom.broadcast(JSON.stringify(
    GameActions.reveal(
      ipfsID, secret, userAction),
  ))
}

function* handleReveal(ipfsID, { userID, secret, action }) {
  console.log(userID, secret, action)
  // const opponentHash = yield select(state => state.game.opponentHash)
  // console.log('opp hash', opponentHash)
  // if (userID !== ipfsID) {
  //   console.log(secret, action, "THE SEC AND ACTION")
  //   if (opponentHash === hash(secret, action)) {
  //     console.log("verified the hash!")
  //     yield put(GameActions.setOpponentAction(action))
  //   }
  // }
}

function* listenForReveal(ipfsID) {
  console.log('I AM CALLED WAIT FOR REVEAL', GameTypes.REVEAL)
  yield take(GameTypes.REVEAL, handleReveal, ipfsID)
  console.log("IN BETWEEN")
  yield take(GameTypes.REVEAL, handleReveal, ipfsID)
  console.log('DID BOTH???')
}

export default function* gameFlow(ipfsID, gameRoom) {
  // generate a secret used to sign transactions
  // during the game
  const secret = cryptoRandomString(10)

  // get the user inputs
  yield [
    call(handleInput, ipfsID, gameRoom, secret),
    call(listenForActions, ipfsID),
  ]
  console.log('FINISHED BOTTTH')

  // reveal what our action was to the other person
  yield [
    call(listenForReveal, ipfsID),
    call(reveal, gameRoom, secret),
  ]
}

// external
import cryptoRandomString from 'crypto-random-string'
import {
  takeEvery,
  take,
  race,
  call,
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

export default function* gameFlow(ipfsID, gameRoom) {
  // generate a secret used to sign transactions
  // during the game
  const secret = cryptoRandomString(10)

  yield [
    call(handleInput, ipfsID, gameRoom, secret),
  ]
}

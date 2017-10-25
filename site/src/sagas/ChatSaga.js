// external
import { eventChannel } from 'redux-saga'
import {
  takeEvery,
  take,
  call,
  fork,
  put,
} from 'redux-saga/effects'
import Room from 'ipfs-pubsub-room'

// internal
import ChatActions, { ChatTypes } from '../redux/chat'

const roomChannel = async (ipfs, room) => {
  const ipfsUser = await ipfs.id()

  return eventChannel((emit) => {
    // get the most recent messages from the channel
    room.on('message', (msg) => {
      if (msg.data.toString() !== room._topic) {
        emit(ChatActions.readMessage(
          msg.data.toString(),
          msg.from === ipfsUser.id,
        ))
      }
    })

    // unsubscribe functions
    return () => room.leave()
  })
}

function* subscribeToRoom(ipfs, room) {
  const messageChannel = yield call(roomChannel, ipfs, room)
  while (true) {
    const action = yield take(messageChannel)
    yield put(action)
  }
}

function* write(room, { content }) {
  yield room.broadcast(content)
}

export default function* chatFlow(ipfs, gameRoom) {
  yield [
    fork(subscribeToRoom, ipfs, gameRoom),
    takeEvery(ChatTypes.SEND_MESSAGE, write, gameRoom),
  ]
}

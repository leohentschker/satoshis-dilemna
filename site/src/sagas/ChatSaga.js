// external
import {
  takeEvery,
  call,
} from 'redux-saga/effects'

// internal
import ChatActions, { ChatTypes } from '../redux/chat'

function* write(room, ipfsID, { content }) {
  yield room.broadcast(JSON.stringify(
    ChatActions.readMessage(content, ipfsID),
  ))
}

export default function* chatFlow(ipfsID, gameRoom) {
  yield [
    takeEvery(ChatTypes.SEND_MESSAGE, write, gameRoom, ipfsID),
  ]
}

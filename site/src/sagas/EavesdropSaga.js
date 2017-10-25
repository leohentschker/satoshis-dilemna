// external
import {
  take,
  call,
  put,
} from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'


const eavesdropRoom = room =>
  eventChannel((emit) => {
    // get the most recent messages from the channel
    room.on('message', (msg) => {
      try {
        const parsed = JSON.parse(msg.data.toString())
        emit(parsed)
      } catch (err) {
        console.error(err)
      }
    })

    // unsubscribe functions
    return () => room.leave()
  })

export default function* eavesdropFlow(room) {
  const roomChannel = yield call(eavesdropRoom, room)
  while (true) {
    const action = yield take(roomChannel)
    yield put(action)
  }
}

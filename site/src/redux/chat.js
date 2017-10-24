import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  sendMessage: ['content'],
  readMessage: ['content', 'fromUser'],
  joinChat: ['chatID'],
})

export const ChatTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  messages: [],
  joining: false,
})

/* ------------- Reducer ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.JOIN_CHAT]: state =>
    state.merge({ joining: true }),

  [Types.SEND_MESSAGE]: state => state,

  [Types.READ_MESSAGE]: (state, msg) =>
    state.merge({
      messages: state.messages.concat([msg]),
    }),
})

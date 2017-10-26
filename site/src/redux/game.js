import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import { GAME_STATE } from '../components/constants'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  testGame: ['gameID', 'peerID'],
  joinGame: ['gameRoom'],
  findGame: ['level'],
  endGame: [],

  setOpponentHash: ['opponentHash'],
  setOpponentAction: ['opponentAction'],
  reveal: ['userID', 'secret', 'action'],

  broadcastAction: ['userID', 'actionHash'],
  submitAction: ['userAction'],

  setId: ['userID'],
})

export const GameTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  gameState: GAME_STATE.LANDING,
  gameRoom: null,

  opponentHash: null,
  opponentAction: null,

  userAction: null,

  userID: null,
})

/* ------------- Reducer ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ID]: (state, { userID }) =>
    state.merge({ userID }),

  [Types.SET_OPPONENT_ACTION]: (state, { opponentAction }) =>
    state.merge({ opponentAction }),

  [Types.SUBMIT_ACTION]: (state, { userAction }) =>
    state.merge({ userAction }),

  [Types.SET_OPPONENT_HASH]: (state, { opponentHash }) =>
    state.merge({ opponentHash }),

  [Types.FIND_GAME]: state =>
    state.merge({ gameState: GAME_STATE.CONNECTING }),

  [Types.JOIN_GAME]: (state, { gameID }) =>
    state.merge({ gameState: GAME_STATE.CONNECTED, gameID }),

  [Types.END_GAME]: () => INITIAL_STATE,
})

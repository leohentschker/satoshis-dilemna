import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import { GAME_STATE } from '../components/constants'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  testGame: ['gameID', 'peerID'],
  joinGame: ['gameRoom'],
  findGame: ['level'],
  endGame: [],
})

export const GameTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  gameState: GAME_STATE.LANDING,
  gameRoom: null,
})

/* ------------- Reducer ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.FIND_GAME]: state =>
    state.merge({ gameState: GAME_STATE.CONNECTING }),

  [Types.JOIN_GAME]: (state, { gameID }) =>
    state.merge({ gameState: GAME_STATE.CONNECTED, gameID }),
})

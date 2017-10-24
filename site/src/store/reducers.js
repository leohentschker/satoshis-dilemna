import { combineReducers } from 'redux'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    game: require('../redux/game').reducer,
    chat: require('../redux/chat').reducer,
    ...asyncReducers,
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

import PropTypes from 'prop-types'
import React from 'react'

import { GAME_STATE } from './constants'
import GameComponent from './GameComponent'
import Connecting from './Connecting'
import Landing from './Landing'

const Content = (props) => {
  if (props.gameState === GAME_STATE.LANDING) {
    return (
      <Landing
        findGame={props.gameActions.findGame}
      />
    )
  }

  if (props.gameState === GAME_STATE.CONNECTING) {
    return <Connecting />
  }

  return <GameComponent {...props} />
}

Content.propTypes = {
  gameActions: PropTypes.object.isRequired,
  gameState: PropTypes.string.isRequired,
}

export default Content

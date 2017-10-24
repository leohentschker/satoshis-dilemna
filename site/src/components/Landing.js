import PropTypes from 'prop-types'
import React from 'react'

import { GAME_LEVEL } from './constants'

const Level = props => (
  <div
    className="level"
    onClick={() => props.findGame(props.level)}
  >
    <div className="level-name">{props.name}</div>
    <div className="level-description">{props.description}</div>
  </div>
)

const Landing = ({ findGame }) => (
  <div id="landing">
    <div className="landing-title"><span>Choose your level</span></div>
    <Level
      description="Free"
      findGame={findGame}
      level={GAME_LEVEL.SZABO}
      name="Szabo"
    />
    <Level
      description="(.05 ETH)"
      findGame={findGame}
      level={GAME_LEVEL.BUTERIN}
      name="Buterin"
    />
    <Level
      description="(.1 ETH)"
      findGame={findGame}
      level={GAME_LEVEL.SATOSHI}
      name="Satoshi"
    />
  </div>
)

Landing.propTypes = {
  findGame: PropTypes.func.isRequired,
}

export default Landing

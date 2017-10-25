import PropTypes from 'prop-types'
import React from 'react'

import ChatWindow from './ChatWindow'

const GameButton = ({ name, submitAction, value }) => (
  <div
    className="game-button"
    onClick={() => submitAction(value)}
  >
    <span>{name}</span>
  </div>
)

GameButton.propTypes = {
  submitAction: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
}

const GameComponent = ({ messages, chatActions, gameActions }) => (
  <div id="game-component">
    <ChatWindow
      sendMessage={chatActions.sendMessage}
      messages={messages}
    />
    <div className="submission-options">
      <GameButton
        name="Betray"
        value={0}
        submitAction={gameActions.submitAction}
      />
      <GameButton
        name="Collude"
        value={1}
        submitAction={gameActions.submitAction}
      />
    </div>
  </div>
)

GameComponent.propTypes = {
  messages: PropTypes.array.isRequired,
}

export default GameComponent

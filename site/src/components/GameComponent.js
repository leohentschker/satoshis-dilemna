import ChatWindow from './ChatWindow'
import PropTypes from 'prop-types'
import React from 'react'

const GameButton = ({ name }) => (
  <div className="game-button">
    <span>{name}</span>
  </div>
)

const GameComponent = ({ messages, chatActions }) => (
  <div id="game-component">
    <ChatWindow
      sendMessage={chatActions.sendMessage}
      messages={messages}
    />
    <div className="submission-options">
      <GameButton name="Betray" />
      <GameButton name="Collude" />
    </div>
  </div>
)

GameComponent.propTypes = {
  messages: PropTypes.array.isRequired,
}

export default GameComponent

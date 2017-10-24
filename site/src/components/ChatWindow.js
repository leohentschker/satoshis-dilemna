import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'


const Message = ({ content, fromUser }) => (
  <div
    className={`message ${fromUser ? 'from-user' : 'from-opponent'}`}
  >
    {content}
  </div>
)

class MessageHistory extends Component {

  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this.dummyDiv)
    node.scrollIntoView({ behavior: 'smooth' })
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  render() {
    return (
      <div className="message-history">
        {
          this.props.messages.map((m, i) => <Message key={i} {...m} />)
        }
        <div ref={el => this.dummyDiv = el}/>
      </div>
    )
  }
}

class SubmissionWindow extends Component {

  static propTypes = {
    sendMessage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      msg: '',
    }

    this.submit = this.submit.bind(this)
  }

  submit() {
    if (this.state.msg.length === 0) {
      return
    }
    this.props.sendMessage(this.state.msg)
    this.setState({ msg: '' })
  }

  render() {
    return (
      <div className="submission-window">
        <input
          placeholder="Type here to send a message..."
          className="submission-input"
          onChange={e => this.setState({ msg: e.target.value })}
          onKeyPress={e => e.key == "Enter" ? this.submit() : null}
          value={this.state.msg}
          type="text"
        />
        <div
          className="submission-button"
          onClick={() => this.submit()}
        >
          <span>SEND</span>
        </div>
      </div>
    )
  }
}

const ChatWindow = ({ messages, sendMessage }) => (
  <div className="chat-window">
    <MessageHistory
      messages={messages}
    />
    <SubmissionWindow
      sendMessage={sendMessage}
    />
  </div>
)

ChatWindow.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
}

export default ChatWindow

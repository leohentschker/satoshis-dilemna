// external
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// internal
import ChatActionCreators from '../redux/chat'
import GameActionCreators from '../redux/game'
import Home from '../components'

const mapDispatchToProps = dispatch => ({
  chatActions: bindActionCreators(ChatActionCreators, dispatch),
  gameActions: bindActionCreators(GameActionCreators, dispatch),
})

const mapStateToProps = state => ({
  gameState: state.game.gameState,
  messages: state.chat.messages,
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import Home from './containers'

const AppContainer = ({ store }) => (
  <Provider store={store}>
    <Home />
  </Provider>
)

AppContainer.propTypes = {
  store: PropTypes.object.isRequired,
}

export default AppContainer

// external
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import swal from 'sweetalert2'

// internal

import Content from './Content'
import './Home.scss'

export default class Home extends Component {

  static propTypes = {
    gameState: PropTypes.string.isRequired,
  }

  componentDidMount() {
    // swal(
    //   'Oh no!',
    //   'Satoshi Nakamoto has stolen you and your best friend\'s private keys! ' +
    //   'Before he deletes them, he is forcing you two to play the following game. ' +
    //   'He has taken "X" eth from both of your accounts and stored it in a smart ' +
    //   'contract. Now, you have two options:=',
    //   'warning',
    // )
  }

  render() {
    return (
      <div id="home">
        <div id="content-wrapper">
          <Content {...this.props} />
        </div>
      </div>
    )
  }
}

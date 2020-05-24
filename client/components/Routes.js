/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import Header from 'components/Header'
import Home from 'components/Home'
import Tips from 'components/Tips'
import About from 'components/About'
import Download from 'components/Download'
import Free from 'components/Free'
import Privacy from 'components/Privacy'
import Terms from 'components/Terms'
import Footer from 'components/Footer'

export default class Routes extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }

  render () {
    return <>
      <Header />
      <div id="content">
        <Route exact path="/" component={Home} context={this.state.context} />
        <Route exact path="/buy/:slug" component={Home} context={this.state.context} />
        <Route path="/(start|templates)" component={Home} context={this.state.context} />
        <Route path="/tips" component={Tips} context={this.state.context} />
        <Route path="/about" component={About} context={this.state.context} />
        <Route path="/download" component={Download} context={this.state.context} />
        <Route path="/promotions" component={Free} context={this.state.context} />
        <Route path="/free" component={Free} context={this.state.context} />
        <Route path="/privacy" component={Privacy} context={this.state.context} />
        <Route path="/terms" component={Terms} context={this.state.context} />
      </div>
      <Footer />
    </>
  }
}

Routes.propTypes = {
  context: PropTypes.object
}

import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import Header from 'components/Header'
import Home from 'components/Home'
import Buy from 'components/Buy'
import Tips from 'components/Tips'
import About from 'components/About'
import Download from 'components/Download'
import Promotions from 'components/Promotions'
import FreeColorPalettes from 'components/FreeColorPalettes'
import Privacy from 'components/Privacy'
import Terms from 'components/Terms'
import Footer from 'components/Footer'

export default class Routes extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <React.Fragment>
      <Header />
      <div id="content">
        <Route exact path="/" component={Home} context={this.state.context} />
        <Route path="/(start|templates|buy)" component={Home} context={this.state.context} />
        <Route path="/buy/:slug" component={Buy} context={this.state.context} />
        <Route path="/tips" component={Tips} context={this.state.context} />
        <Route path="/about" component={About} context={this.state.context} />
        <Route path="/download" component={Download} context={this.state.context} />
        <Route path="/promotions" component={Promotions} context={this.state.context} />
        <Route exact path="/free" component={Promotions} context={this.state.context} />
        <Route path="/free/color-palettes" component={FreeColorPalettes} context={this.state.context} />
        <Route path="/privacy" component={Privacy} context={this.state.context} />
        <Route path="/terms" component={Terms} context={this.state.context} />
      </div>
      <Footer />
    </React.Fragment>
  }
}

Routes.propTypes = {
  context: PropTypes.object
}

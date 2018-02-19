import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from 'components/Header';
import Templates from 'components/Templates';
import Buy from 'components/Buy';
import Tips from 'components/Tips';
import About from 'components/About';
import Thanks from 'components/Thanks';
import Download from 'components/Download';
import Auth from 'components/Auth';
import Logout from 'components/Logout';
import Account from 'components/Account';
import Footer from 'components/Footer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <BrowserRouter>
      <React.Fragment>
        <Header/>
        <div id="content">
          <Route exact path="/" component={Templates}/>
          <Route path="/(templates|buy)" component={Templates}/>
          <Route path="/buy/:slug" component={Buy}/>
          <Route path="/tips" component={Tips}/>
          <Route path="/about" component={About}/>
          <Route path="/thanks" component={Thanks}/>
          <Route path="/download" component={Download}/>
          <Route path="/login" component={Auth}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/account" component={Account}/>
        </div>
        <Footer/>
      </React.Fragment>
    </BrowserRouter>;
  }
}

import React from 'react';
import Header from 'components/Header';
import Templates from 'components/Templates';
import Tips from 'components/Tips';
import About from 'components/About';
import Thanks from 'components/Thanks';
import Download from 'components/Download';
import Auth from 'components/Auth';
import Account from 'components/Account';
import Footer from 'components/Footer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <React.Fragment>
      <Header/>
      <div id="content">
        <Templates/>
        <Tips/>
        <About/>
        <Thanks/>
        <Download/>
        <Auth/>
        <Account/>
      </div>
      <Footer/>
    </React.Fragment>;
  }
}

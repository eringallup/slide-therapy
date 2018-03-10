import React from 'react';
import { Route } from 'react-router-dom';
import Header from 'components/Header';
import Templates from 'components/Templates';
import Buy from 'components/Buy';
import Tips from 'components/Tips';
import About from 'components/About';
import Thanks from 'components/Thanks';
import Download from 'components/Download';
import Footer from 'components/Footer';

export default <React.Fragment>
  <Header/>
  <div id="content">
    <Route exact path="/" component={Templates}/>
    <Route path="/(templates|buy)" component={Templates}/>
    <Route path="/buy/:slug" component={Buy}/>
    <Route path="/tips" component={Tips}/>
    <Route path="/about" component={About}/>
    <Route path="/thanks" component={Thanks}/>
    <Route path="/download" component={Download}/>
  </div>
  <Footer/>
</React.Fragment>;

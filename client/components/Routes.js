import React from 'react';
import PropTypes from 'prop-types';
import dataStore from 'store';
import marked from 'marked';
import { Route } from 'react-router-dom';
import Header from 'components/Header';
import Templates from 'components/Templates';
import Buy from 'components/Buy';
import Tips from 'components/Tips';
import About from 'components/About';
import Thanks from 'components/Thanks';
import Download from 'components/Download';
import Footer from 'components/Footer';

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentWillMount() {
    if (typeof global.window !== 'undefined') {
      let posts = [];
      if (window.appContext) {
        window.appContext.blogPosts.forEach(post => {
          posts.push(marked(post));
        });
      }
      dataStore.dispatch({
        type: 'update',
        posts: posts
      });
    }
  }
  render() {
    return <React.Fragment>
      <Header/>
      <div id="content">
        <Route exact path="/" component={Templates} context={this.state.context}/>
        <Route path="/(templates|buy)" component={Templates} context={this.state.context}/>
        <Route path="/buy/:slug" component={Buy} context={this.state.context}/>
        <Route path="/tips" component={Tips} context={this.state.context}/>
        <Route path="/about" component={About} context={this.state.context}/>
        <Route path="/thanks" component={Thanks} context={this.state.context}/>
        <Route path="/download" component={Download} context={this.state.context}/>
      </div>
      <Footer/>
    </React.Fragment>;
  }
}

Routes.propTypes = {
  context: PropTypes.object
};

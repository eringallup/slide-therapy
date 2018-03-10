import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import dataStore from 'store';

export default class Tips extends React.Component {
  constructor(props) {
    super(props);
    let posts = [];
    const postData = props.staticContext && props.staticContext.blogPosts;
    if (postData) {
      postData.forEach(post => {
        posts.push(marked(post));
      });
    }
    this.state = {};
    Object.assign(this.state, props, {
      posts: posts.join('')
    });
  }
  componentDidMount() {
    let currentState = dataStore.getState();
    this.setState({
      posts: currentState.posts.join('')
    });
  }
  render() {
    return <section id="view-tips" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2>Tips</h2>
            <div
              id="blogPosts"
              suppressHydrationWarning={true}
              dangerouslySetInnerHTML={{
                __html: this.state.posts
              }}
            />
          </div>
        </div>
      </div>
    </section>;
  }
}

Tips.propTypes = {
  staticContext: PropTypes.object
};

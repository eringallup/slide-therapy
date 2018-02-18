import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <header className="container">
      <div className="row">
        <div className="col-sm-5">
          <h1><a href="/"><img className="img-fluid" src="//d380dcsmppijhx.cloudfront.net/images/SlideTherapyLogo.png" alt="Slide Therapy" width="300" height="72"/></a></h1>
        </div>
        <div className="col-sm-7 d-flex align-items-center justify-content-center justify-content-sm-end">
          <nav className="main-nav nav">
            <a className="nav-link nav-templates" href="/">Templates</a>
            <a className="nav-link nav-tips" href="/tips">Tips</a>
            <a className="nav-link nav-about" href="/about">About</a>
            <span id="nav-user"></span>
          </nav>
        </div>
      </div>
    </header>;
  }
}

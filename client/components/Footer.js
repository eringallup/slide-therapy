import React from 'react';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <footer>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <p>&copy; 2018 Gallup Interactive.<br/>
            All Rights Reserved.</p>
          A helpful project by <a target="_blank" rel="noopener noreferrer" href="http://eringallup.com">Gallup</a> and <a target="_blank" rel="noopener noreferrer" href="http://jimmybyrum.com">Byrum</a>
          </div>
        </div>
      </div>
    </footer>;
  }
}

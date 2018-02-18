import React from 'react';
import skus from 'skus.json';
import download from 'download';
import dataStore from 'store';

export default class OwnedDecks extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  downloadDeck(e, oid) {
    e.preventDefault();
    let currentState = dataStore.getState();
    if (!currentState.user) {
      Router.go('/');
      return;
    }
    download.ownedDeck(currentState.user, oid);
  }
  render() {
    const decksHtml = this.state.orders.map(order => {
      let deck = skus[order.sku];
      return <li key={order.oid}><a onClick={(e) => this.downloadDeck(e, order.oid)} href={'/download?o=' + order.oid}>{deck.title}</a></li>;
    });
    return <React.Fragment><h2>Your decks</h2><ul className="list-unstyled">{decksHtml}</ul></React.Fragment>;
  }
}

import React from 'react';
import axios from 'axios';
import skus from 'skus.json';
import download from 'download';
import dataStore from 'store';
import cacheStack from 'cache-stack';
import * as account from 'account';

export default class OwnedDecks extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    dataStore.subscribe(() => {
      let currentState = dataStore.getState();
      this.setState({
        user: currentState.user
      });
      if (this.state.user) {
        this.getDecks();
      }
    });
  }
  componentDidMount() {
    if (this.state.user) {
      this.getDecks();
    }
  }
  getDecks() {
    this.decksData = cacheStack(callback => {
      let headers = account.apiHeaders();
      headers['Content-Type'] = 'application/json';
      axios({
        method: 'GET',
        headers: headers,
        url: 'https://hwwhk00ik9.execute-api.us-west-2.amazonaws.com/prod/getDecks'
      }).then(callback).catch(console.error);
    }, {
      key: 'getDecks'
    }, json => {
      this.setState({
        orders: json.data.body.Items
      });
    });
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
    if (!this.state.orders || !this.state.orders.length) {
      return '';
    }
    const decksHtml = this.state.orders.map(order => {
      let deck = skus[order.sku];
      return <li key={order.oid}><a onClick={(e) => this.downloadDeck(e, order.oid)} href={'/download?o=' + order.oid}>{deck.title}</a></li>;
    });
    return <React.Fragment><h2>Your decks</h2><ul className="list-unstyled">{decksHtml}</ul></React.Fragment>;
  }
}

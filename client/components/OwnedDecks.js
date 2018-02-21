import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cacheStack from 'cache-stack';
import skus from 'skus.json';
import download from 'lib/download';
import dataStore from 'lib/store';
import { apiHeaders } from 'lib/account';

export default class OwnedDecks extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
    dataStore.subscribe(() => {
      let currentState = dataStore.getState();
      this.setState({
        user: currentState.user
      });
      this.getDecks();
    });
  }
  componentDidMount() {
    this.getDecks();
  }
  getDecks() {
    let currentState = dataStore.getState();
    if (!currentState.user) {
      return;
    }
    cacheStack(callback => {
      let headers = apiHeaders();
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
      return <li key={order.oid}><Link to={{
        pathname: '/download',
        search: '?o=' + order.oid
      }} onClick={(e) => this.downloadDeck(e, order.oid)}>{deck.title}</Link></li>;
    });
    return <React.Fragment><h2>Your decks</h2><ul className="list-unstyled">{decksHtml}</ul></React.Fragment>;
  }
}

'use strict';

const firebase = require('firebase');

const firebaseConfig = {
  apiKey: 'lf8QtCfFkgCbBROY9V9FLpyjMWtZlW6krUoMAHtz',
  authDomain: 'slidetherapy-970be.firebaseapp.com',
  databaseURL: 'https://slidetherapy.firebaseio.com',
  storageBucket: '<BUCKET>.appspot.com',
}
;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

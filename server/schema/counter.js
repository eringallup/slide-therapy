const { Model } = require('./model');
const { Collection } = require('./collection');

class Counter extends Model {
  constructor() {
    super();
  }
}

class Counters extends Collection {
  constructor(data) {
    super(data);
  }
}

module.exports = {
  Counter: Counter,
  Counters: Counters
};
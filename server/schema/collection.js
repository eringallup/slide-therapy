const _ = require('lodash');

module.exports.Collection = class {
  constructor(model, data) {
    this.index = {};
    this.model = model;
    this.set(data);
    return this;
  }

  get(id) {
    if (id) {
      return this.getById(id);
    }
    return _.values(this.index);
  }

  getById(id) {
    return _.findWhere(this.index, {
      id: id
    });
  }

  set(data) {
    if (!Array.isArray(data)) {
      throw new Error('Expected data to be an array');
    }
    data.forEach(datum => {
      const model = new this.model(datum);
      this.index[model.id] = model;
    });
    return this;
  }
}
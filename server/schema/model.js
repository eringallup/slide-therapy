module.exports.Model = class {
  constructor(data = {}) {
    this.created = data.created || new Date();
    this.modified = data.modified || new Date();
    return this;
  }
};
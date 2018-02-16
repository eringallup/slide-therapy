import { createStore } from 'redux';

function dataStore(state = {}, action) {
  if (action.type === 'logout') {
    state.user = undefined;
  } else {
    Object.keys(action).forEach(item => {
      state[item] = action[item];
    });
  }
  return state;
}

let store = createStore(dataStore);

module.exports = store;
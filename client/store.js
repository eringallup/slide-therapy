import { createStore } from 'redux';

function dataStore(state = {}, action) {
  Object.keys(action).forEach(item => {
    state[item] = action[item];
  });
  return state;
}

let store = createStore(dataStore);

export default store;

import makeStore from './src/store';
import startServer from './src/server';
import {fromJS} from 'immutable';

export const store = makeStore();
//startServer(store);

store.dispatch({
  type: 'SET_STATE',
  todos: fromJS(require('../todos.json'))
});

console.log('INITIAL STATE',store.getState());
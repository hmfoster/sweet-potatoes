import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import makeStore from '../src/store';

describe('store', () => {
  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(Map());

    store.dispatch({type: 'SET_STATE', todos: fromJS({
      'Vaccuum': {
        priority: 5,
        deadline: new Date(2015, 10, 10),
        context: 'Chores', 
        time: 0.5
      }
    })});

    expect(store.getState()).to.equal(fromJS({
      todos: {
        'Vaccuum': {
          priority: 5,
          deadline: new Date(2015, 10, 10),
          context: 'Chores',
          time: 0.5
        } 
      }, 
      list: [],
      nextTodo: 'Vaccuum'
    }));
  });
});
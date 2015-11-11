import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';

describe('reducer', () => {
  const todos = fromJS({
    'Vaccuum' : {
      context: 'Chores', 
      priority: 5,
      deadline: new Date(2015, 10, 8),
      time: 0.5
    }, 
    'Call Mom': {
      context: 'Chores', 
      priority: 5,
      deadline: new Date(2015, 10, 11),
      time: 0.5
    }
  });
  
  it('has an initial state', () => {
    const action = {type: 'SET_STATE', todos: todos};
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.5
        }, 
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        }
      },
      list: ['Call Mom'],
      nextTodo: 'Vaccuum'
    }))
  });

  it('handles SET_STATE', () => {
    const initialState = Map();
    const action = {type: 'SET_STATE', todos}; 
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.5
        }, 
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        }
      },
      list: ['Call Mom'],
      nextTodo: 'Vaccuum'
    }));
  });
  it('handles ADD_TODO', () => {
    const initialState = fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 9),
          time: 0.5
        }, 
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        }
      },
      list: ['Call Mom'],
      nextTodo: 'Vaccuum'
    });
    const action = {type: 'ADD_TODO', todo:{
      title: 'Clean Sink',
      deadline: new Date(2015, 10, 8),
      priority: 10,
      context: 'Chores',
      time: 0.25
    }}
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 9),
          time: 0.5
        }, 
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        },
        'Clean Sink': {
              deadline: new Date(2015, 10, 8),
              priority: 10,
              context: 'Chores',
              time: 0.25
        }
      },
      list: ['Vaccuum','Call Mom'],
      nextTodo: 'Clean Sink'
    }));
  });

  it('handles COMPLETE_TODO', () => {
    const initialState = fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.5
        }, 
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        },
        'Clean Sink': {
              deadline: new Date(2015, 10, 8),
              priority: 10,
              context: 'Chores',
              time: 0.25
        }
      },
      list: ['Vaccuum','Call Mom'],
      nextTodo: 'Clean Sink'
    });

    const action = {type: 'COMPLETE_TODO', todo: 'Call Mom'};
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.5
        },
        'Clean Sink': {
              deadline: new Date(2015, 10, 8),
              priority: 10,
              context: 'Chores',
              time: 0.25
        }
      },
      list: ['Vaccuum'],
      nextTodo: 'Clean Sink', 
      completedTodos: {
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        }
      }
    }));

    const nextAction = {type: 'COMPLETE_TODO', todo: undefined};
    const finalState = reducer(nextState, nextAction);
    expect(finalState).to.equal(fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.5
        }
      },
      list: [],
      nextTodo: 'Vaccuum', 
      completedTodos: {
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        },
        'Clean Sink': {
          deadline: new Date(2015, 10, 8),
          priority: 10,
          context: 'Chores',
          time: 0.25
        }
      }
    }));
  });
  it('handles EDIT_TODO', () => { 
    const initialState = fromJS({
      todos: {
        'Vaccuum' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.5
        },
        'Clean Sink': {
              deadline: new Date(2015, 10, 8),
              priority: 10,
              context: 'Chores',
              time: 0.25
        }
      },
      list: ['Vaccuum'],
      nextTodo: 'Clean Sink', 
      completedTodos: {
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        }
      }
    });

    const action = {type: 'EDIT_TODO', todo: 'Vaccuum', details: {title: 'Sweep', time: 0.25}}; 
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      todos: {
        'Sweep' : {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 8),
          time: 0.25
        },
        'Clean Sink': {
              deadline: new Date(2015, 10, 8),
              priority: 10,
              context: 'Chores',
              time: 0.25
        }
      },
      list: ['Sweep'],
      nextTodo: 'Clean Sink', 
      completedTodos: {
        'Call Mom': {
          context: 'Chores', 
          priority: 5,
          deadline: new Date(2015, 10, 11),
          time: 0.5
        }
      }
    }))
  });
  it('handles SPLIT_TODOS', () => {
    const initialState = fromJS({
      todos: {
        Essay : {
          context: 'School',
          priority: 10,
          deadline: new Date(2015, 10, 11),
          time: 1.2
        }
      }
    });
    const action = {type: 'SPLIT_TODO', todo: 'Essay', date: new Date(2015, 10, 5)};

    const nextState = reducer(initialState, action);
    const expectedState = fromJS({
      todos: {
        'Essay 1' : {
          context : 'School',
          priority : 10,
          deadline : new Date(2015, 10, 7),
          time : 0.4, 
          late: true
        },
        'Essay 2' : {
          context : 'School',
          priority : 10,
          deadline : new Date(2015, 10, 9),
          time : 0.4
        },
        'Essay 3' : {
          context : 'School',
          priority : 10,
          deadline : new Date(2015, 10, 11),
          time : 0.4
        }
      },
      list: ['Essay 2', 'Essay 3'],
      nextTodo : 'Essay 1'
    });
    expect(nextState).to.equal(expectedState);
  });

});
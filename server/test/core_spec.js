import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setTodos, createTodo, addTodo, prioritize, nextTask, completeTodo, editTodo} from '../src/core';

describe('application logic', () => {
  var vaccuum = Map({
            context: 'Chores', 
            priority: 10,
            deadline: new Date(2015,10,5),
            time: 0.5,
          });
  var call = Map({
            context: 'Family',
            priority: 0,
            deadline: new Date(2015, 10, 7), 
            time: 1
          });
  var meeting = Map({
            context: 'Work',
            priority: 10,
            deadline: new Date(2015,10,15), 
            time: 0.25
          });

  describe('setTodos', () => {
    
    it('adds all existing todos to the state', () => {
      const state = Map();
      const todos = Map({
        Vaccuum : vaccuum,
        'Call Mom': call
      });
      const nextState = setTodos(state, todos);
      
      expect(nextState).to.equal(Map({
        todos : Map({
          Vaccuum : vaccuum,
          'Call Mom': call
        })
      }));
    });

  });

  describe('createTodo', () => {
    it('creates a new todo from user input', () => {
      const newTodo = createTodo('Vaccuum', 'Chores', 10, new Date(2015, 10, 5), 0.5);
      expect(newTodo).to.equal(Map({
        'Vaccuum': vaccuum
      }));
    });
  });

  describe('addTodo', () => {
    it('adds a new todo to the state', () => {
      const state = Map({
        todos : Map({
          'Call Mom': call
        })
      });

      const newTodo = createTodo('Vaccuum', 'Chores', 10, new Date(2015, 10, 5), 0.5);
      const nextState = addTodo(state, newTodo);
      expect(nextState).to.equal(Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum
        })
      }));
    });
  });

  describe('prioritize', () => {
    it('adds a prioritized List of todos to the state', () => {
      const state = Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        })
      });

      const nextState = prioritize(state);
      expect(nextState).to.equal(Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        }),
        list : List(['Vaccuum', 'Schedule Meeting', 'Call Mom'])
      }));
    });
  });

  describe('nextTask', () => {
    it('sets the highest proritized todo to the current task', () => {
      const state = Map({
          todos : Map({
            'Call Mom': call,
            Vaccuum : vaccuum,
            'Schedule Meeting': meeting
          }),
          list : List(['Vaccuum', 'Schedule Meeting', 'Call Mom'])
        });

      const nextState = nextTask(state);

      expect(nextState).to.equal(Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        }),
        list : List(['Schedule Meeting', 'Call Mom']),
        nextTask : 'Vaccuum'
      }));
    });
  });

  describe('completeTask', () => {
    it('completes the given task', () => {
      const state = Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        }),
        list : List(['Schedule Meeting', 'Call Mom']),
        nextTask : 'Vaccuum'
      });
      const nextState = completeTodo(state, 'Call Mom');
      expect(nextState).to.equal(Map({
        todos : Map({
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        }),
        list : List(['Schedule Meeting']),
        nextTask : 'Vaccuum',
        completedTodos : Map({
          'Call Mom': call,
        })
      }));
    });

    it('completes the current task if no other task given', () =>{
      const state = Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        }),
        list : List(['Schedule Meeting', 'Call Mom']),
        nextTask : 'Vaccuum'
      });

      const nextState = completeTodo(state);
      expect(nextState).to.equal(Map({
        todos : Map({
          'Call Mom': call,
          'Schedule Meeting': meeting
        }),
        list : List(['Call Mom']),
        nextTask : 'Schedule Meeting',
        completedTodos : Map({
          Vaccuum : vaccuum
        })
      }));
    });
  });
  
  describe('editTask', () => {
    const state = Map({
      todos: Map({
        Vaccuum: vaccuum,
        'Call Mom': call,
        'Schedule Meeting': meeting
      }), 
      list: List(['Schedule Meeting', 'Call Mom']),
      nextTask: 'Vaccuum'
    });

    it('updates an edited title', () => {
      const nextState = editTodo(state, 'Call Mom', {title: 'Call Dad'});
      expect(nextState).to.equal(Map({
        todos: Map({
          Vaccuum: vaccuum,
          'Call Dad': call,
          'Schedule Meeting': meeting
        }), 
        list: List(['Schedule Meeting', 'Call Dad']),
        nextTask: 'Vaccuum'
      }));
    });

    it('updates edited todo details', () => {
      const nextState = editTodo(state, 'Call Mom', {
        priority: 5,
        time: 0.5
      });
      console.log(nextState);
      const expectedState = Map({
        todos: Map({
          Vaccuum: vaccuum,
          'Call Mom': Map({
            context: 'Family',
            priority: 5,
            deadline: new Date(2015, 10, 7), 
            time: 0.5
          }),
          'Schedule Meeting': meeting
        }),
        list: List(['Schedule Meeting', 'Call Mom']),
        nextTask: 'Vaccuum'
      });

      console.log(expectedState)
      expect(nextState).to.equal(expectedState);
    });
  });
});
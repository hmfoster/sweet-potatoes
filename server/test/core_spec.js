import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setState, createTodo, addTodo, completeTodo, editTodo, splitTodo} from '../src/core';

describe('application logic', () => {
  const setDate = (days) => {
    let date = new Date((new Date()).getTime() + days*24*60*60*1000);
    date.setHours(0,0,0);
    return date;
  }
  var vaccuum = Map({
            context: 'Chores', 
            priority: 10,
            deadline: setDate(1),
            time: 0.5,
          });
  var call = Map({
            context: 'Family',
            priority: 0,
            deadline: setDate(2), 
            time: 1
          });
  var meeting = Map({
            context: 'Work',
            priority: 10,
            deadline: setDate(10), 
            time: 0.25
          });

  describe('setState', () => {
    const state = Map();
    
    it('adds all existing todos to the state', () => {
      const todos = Map({
        Vaccuum : vaccuum,
        'Call Mom': call
      });
      const nextState = setState(state, todos);
      
      expect(nextState.get('todos')).to.equal(Map({
        Vaccuum : vaccuum,
        'Call Mom': call
      }));
    });

    it('marks any todos that are past due', () => {
      const todos = Map({
        'Vaccuum': vaccuum,
        'Buy Card' : Map({
          context: 'Family',
          deadline: new Date(2015, 10, 5)
        }) 
      });
      const nextState = setState(state, todos);
      expect(nextState.get('todos')).to.equal(Map({
        Vaccuum : vaccuum, 
        'Buy Card' : Map({
        context: 'Family',
        deadline: new Date(2015, 10, 5),
        late : true
        })
      }));
    });

    it('creates a prioritized list of todos and marks the next todo', () => {
      const todos = Map({
        'Call Mom': call,
        Vaccuum : vaccuum,
        'Schedule Meeting': meeting
      });

      const nextState = setState(state, todos);

      expect(nextState.get('list')).to.equal(List(['Schedule Meeting', 'Call Mom']));
      expect(nextState.get('nextTodo')).to.equal('Vaccuum');
    });
  });

  describe('addTodo', () => {
    it('adds a new todo to the state', () => {
      const state = Map({
        todos : Map({
          'Call Mom': call
        })
      });

      const newTodo = {
        title: 'Vaccuum', 
        context: vaccuum.get('context'), 
        priority: vaccuum.get('priority'), 
        deadline: vaccuum.get('deadline'), 
        time: vaccuum.get('time')
      };
      const nextState = addTodo(state, newTodo);
      const expectedState = Map({
        todos : Map({
          'Call Mom': call,
          Vaccuum : vaccuum
        }), 
        list: List(['Call Mom']),
        nextTodo : 'Vaccuum'
      });
      expect(nextState).to.equal(expectedState);
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
        nextTodo : 'Vaccuum'
      });
      const nextState = completeTodo(state, 'Call Mom');
      expect(nextState).to.equal(Map({
        todos : Map({
          Vaccuum : vaccuum,
          'Schedule Meeting': meeting
        }),
        list : List(['Schedule Meeting']),
        nextTodo : 'Vaccuum',
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
        nextTodo : 'Vaccuum'
      });

      const nextState = completeTodo(state);
      expect(nextState).to.equal(Map({
        todos : Map({
          'Call Mom': call,
          'Schedule Meeting': meeting
        }),
        list : List(['Call Mom']),
        nextTodo : 'Schedule Meeting',
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
      nextTodo: 'Vaccuum'
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
        nextTodo: 'Vaccuum'
      }));
    });

    it('updates edited todo details', () => {
      const nextState = editTodo(state, 'Call Mom', {
        priority: 5,
        time: 0.5
      });
      const expectedState = Map({
        todos: Map({
          Vaccuum: vaccuum,
          'Call Mom': Map({
            context: 'Family',
            priority: 5,
            deadline: call.get('deadline'), 
            time: 0.5
          }),
          'Schedule Meeting': meeting
        }),
        list: List(['Schedule Meeting', 'Call Mom']),
        nextTodo: 'Vaccuum'
      });
      expect(nextState).to.equal(expectedState);
    });

    it('updates edited title and details', () => {
      const nextState = editTodo(state, 'Vaccuum', {
        title: 'Sweep', 
        time: 0.25
      });
      expect(nextState).to.equal(Map({
        todos: Map({
          Sweep: Map({
            context: 'Chores', 
            priority: 10,
            deadline: vaccuum.get('deadline'),
            time: 0.25,
          }),
          'Call Mom': call,
          'Schedule Meeting': meeting
        }),
        list: List(['Schedule Meeting', 'Call Mom']),
        nextTodo: 'Sweep'
      }));
    });
  });
  describe('splitTodo', () => {
    it('splits up a task with a time > 1 into smaller tasks of max time 0.5', () => {
      const state = Map({
        todos: Map({
          'Essay' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 10),
            time : 2
          })
        })
      });
      const nextState = splitTodo(state, 'Essay', new Date(2015, 10, 5));
      expect(nextState).to.equal(Map({
        todos: Map({
          'Essay 1' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 6),
            time : 0.5,
            late: true
          }),
          'Essay 2' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 7),
            time : 0.5, 
            late: true
          }),
          'Essay 3' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 8),
            time : 0.5
          }),
          'Essay 4' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 10),
            time : 0.5
          })
        }),
        list : List(['Essay 2', 'Essay 3', 'Essay 4']),
        nextTodo : 'Essay 1'
      }));
    });
    it('splits up a task time%0.5 !== 0 into evenly split smaller tasks of max time 0.5', () => {
      const state = Map({
        todos: Map({
          'Essay' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 10),
            time : 1.2
          })
        })
      });
      const nextState = splitTodo(state, 'Essay', new Date(2015, 10, 5));
      expect(nextState.get('todos')).to.equal(Map({
          'Essay 1' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 6),
            time : 0.4, 
            late: true
          }),
          'Essay 2' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 8),
            time : 0.4
          }),
          'Essay 3' : Map({
            context : 'School',
            priority : 10,
            deadline : new Date(2015, 10, 10),
            time : 0.4
          })
      }));
    });
  });
});
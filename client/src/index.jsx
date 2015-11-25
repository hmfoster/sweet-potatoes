import React from 'react';
import ReactDOM from 'react-dom';
import Todos from './components/todos';

const todos = {
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
}

ReactDOM.render(
  <Todos todos={todos} />,
  document.getElementById('app')
);
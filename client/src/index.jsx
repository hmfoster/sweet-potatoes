import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import reducer from './reducer';
import Todos from './components/todos';

const todos = {
  todos: {
    'Vaccuum' : {
      context: 'Chores', 
      priority: 2,
      deadline: new Date(2015, 10, 18),
      time: 0.5
    }, 
    'Call Mom': {
      context: 'Chores', 
      priority: 2,
      deadline: new Date(2015, 10, 30),
      time: 0.5
    },
    'Clean Sink': {
          deadline: new Date(2015, 10, 25),
          priority: 3,
          context: 'Chores',
          time: 0.25
    }
  },
  list: ['Vaccuum','Call Mom'],
  nextTodo: 'Clean Sink'
};

ReactDOM.render(
  <Todos todos={todos} />,
  document.getElementById('app')
);
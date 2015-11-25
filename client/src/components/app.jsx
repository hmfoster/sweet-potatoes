import React from 'react';
import {Map} from 'immutable';

const todos = Map({
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
});

export default React.createClass({
  render: function() {
    //return React.cloneElement(this.props.children, {todos: todos});
  }
});
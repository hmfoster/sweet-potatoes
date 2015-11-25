import React from 'react';
import Todo from './todo';

export default React.createClass({
  getList: function(){
    return this.props.todos.list || [];
  }, 
  getTodo: function(todo){
    return this.props.todos.todos[todo];
  },
  render: function() {
    return <div>
        <div className="up-next">
          <h1>Up Next</h1>
          <Todo title={this.props.todos.nextTodo} todo={this.getTodo(this.props.todos.nextTodo)} />
        </div>
        <div className="coming-up">
          <h2> Coming Up </h2>
            <ul>
              {this.getList().map(todo =>
              <li key={todo}>
                <Todo title={todo} todo={this.getTodo(todo)} />
              </li>
              )}
            </ul>
        </div>
      </div>;
  }
});
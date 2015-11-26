import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Todo from './todo';

export const Todos = React.createClass({
  mixins: [PureRenderMixin],
  getList: function(){
    return this.props.list || [];
  }, 
  getTodo: function(todo){
    return this.props.todos.get(todo);
  },
  render: function() {
    return <div>
        <div className="up-next">
          <h1>Up Next</h1>
          <Todo title={this.props.nextTodo} todo={this.getTodo(this.props.nextTodo)} />
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

function mapStateToProps(state) {
  return {
    todos: state.get('todos'),
    list: state.get('list'),
    nextTodo: state.get('nextTodo')
  };
}

export const TodosContainer = connect(mapStateToProps)(Todos);


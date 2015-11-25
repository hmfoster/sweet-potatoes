import React from 'react';

export default React.createClass({
  getPriority: function(){
    return '*'*this.props.todo;
  },
  getTime: function(){
    var hours = this.props.todo.time;
    if (hours>1){
      return hours + ' h';
    }
    var minutes = 60*hours;
    return minutes + ' min';
  },

  render: function() {
    return <div className="todos">
        <h3>{this.props.title}</h3>
    </div>;
  }
});
        // <span>{this.getPriority()}</span>
        // <span>{this.props.todo.deadline}</span>
        // <span>{this.props.todo.context}</span>
        // <span>{this.getTime()}</span>
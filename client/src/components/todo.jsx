import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Controls from './controls.jsx';

export default React.createClass({
  mixins: [PureRenderMixin],
  getPriority: function(){
    var i = this.props.todo.priority;
    var stars = '';
    while (stars.length<i){
      stars += '*';
    }
    return stars;
  },
  getTime: function(){
    var hours = this.props.todo.time;
    if (hours>1){
      return hours + ' h';
    }
    var minutes = 60*hours;
    return minutes + ' min';
  },
  getDeadline: function(){
    var days = Math.round((this.props.todo.deadline.getTime() - (new Date()).getTime())/(1000*60*60*24));
    if (days<0){
      return "PAST DUE";
    }
    return days;
  },
  render: function() {
    return <div className="todos">
        <h3>{this.props.title}</h3>
        <Controls title={this.props.title}/>
        <span>{this.getPriority()}  </span>
        <span>{this.getTime()}  </span>
        <span>{this.props.todo.context} </span>
        <span>{this.getDeadline()}</span>
    </div>;
  }
});
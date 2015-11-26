import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {createStore} from 'redux';
import reducer from './reducer';
import {Provider} from 'react-redux';
import App from './components/app';
import {TodosContainer} from './components/todos';

const store = createStore(reducer);
store.dispatch({
  type: 'SET_STATE',
  state: {
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
  }
});


const routes = <Route component={App}>
  <Route path="/" component={TodosContainer} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
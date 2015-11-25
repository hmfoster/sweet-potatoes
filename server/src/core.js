import {List,Map} from 'immutable';

export const INITIAL_STATE = Map();

function getUrgency(todo){
  const dayInMs = 24*60*60*1000;
  const timeUntil = new Date(todo.get('deadline')).getTime() - (new Date()).getTime();
  if (timeUntil < dayInMs){
    return 10;
  } else if (timeUntil < dayInMs*3){
    return 5;
  } else if (timeUntil < dayInMs*7){
    return 3;
  } else {
    return 0;
  }
};

function getPriority(todos, todo){
  const thisTodo = todos.get(todo);
  return thisTodo.get('priority') + getUrgency(thisTodo);
};

function prioritize(todos){
  return Object.keys(todos.toJS()).sort(function(a,b){
    return getPriority(todos, b) - getPriority(todos, a);
  });
};
  

export function setState(state, currentTodos){
  const todos = currentTodos.map((todo) => {
    if (new Date(todo.get('deadline')).getTime() <= new Date().getTime()){
      return todo.merge({'late': true});
    }
    else return todo;
  });

  const list = List(prioritize(todos));
  
  return state.merge({
    'todos' : Map(todos),
    'list' : list.skip(1), 
    'nextTodo' : list.first()
    });
};

export function addTodo(state, {title, priority, context, deadline, time}){
  let details = {};
  details[title] = Map({context, priority, deadline, time});
  const todos = state.get('todos').merge(details);
  return setState(state, todos);
};

export function completeTodo(state, completedTodoTitle = state.get('nextTodo')){
  const todos = state.get('todos');
  const completedTodo = {};
  completedTodo[completedTodoTitle] = todos.get(completedTodoTitle);
  return setState(state.mergeIn(['completedTodos'], completedTodo), todos.delete(completedTodoTitle));
}

export function editTodo(state, todo, {
                                        title = todo, 
                                        context = state.getIn(['todos', todo, 'context']), 
                                        priority = state.getIn(['todos', todo, 'priority']), 
                                        deadline = state.getIn(['todos', todo, 'deadline']), 
                                        time = state.getIn(['todos', todo, 'time'])
                                      }){
  const newTodo = {};
  newTodo[title] = {context, priority, deadline, time};
  return setState(state, state.get('todos').delete(todo).merge(newTodo))
}

export function splitTodo(state, todo, now = new Date()){
  const {time, deadline, priority, context} = state.getIn(['todos', todo]).toJS();
  const numberSplits = Math.ceil(time/0.5);
  const splitTimes = Math.round(time*100/numberSplits)/100;
  const splitDates = ((new Date(deadline)).getTime() - now.getTime())/numberSplits;
  const splitTodos = {};

  for (let i = 1; i<= numberSplits; i++){
    splitTodos[todo + ' ' + i] = {
      context,
      priority,
      deadline: new Date((new Date(now.getTime() + splitDates*(i))).setHours(0,0,0)),
      time: splitTimes,
    }
  }
  
  const todos = state.get('todos').delete(todo).merge(splitTodos);
  return setState(state, todos);
}
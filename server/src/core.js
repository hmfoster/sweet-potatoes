import {List,Map} from 'immutable';

export function setTodos(state, todos){
  return state.set('todos', Map(todos));
};

export function createTodo(title, context, priority, deadline, time){
  var details = {};
  details[title] = Map({context, priority, deadline, time});
  return Map(details);
}

export function addTodo(state, newTodo){
  return state.mergeIn(['todos'], newTodo);
};


function getUrgency(todo){
  const dayInMs = 24*60*60*1000;
  const timeUntil = todo.get('deadline').getTime() - (new Date()).getTime();
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

export function prioritize(state){
  const todos = state.get('todos');
  const list = Object.keys(todos.toJS()).sort(function(a,b){
    return getPriority(todos, b) - getPriority(todos, a);
  });
  return state.set('list', List(list));
}

export function nextTask(state){
  const list = state.get('list');
  return state.merge({
    'nextTask' : list.first(), 
    'list' : list.skip(1)
    });
}

export function completeTodo(state, completedTodoTitle = state.get('nextTask')){
  const completedTodo = {};
  completedTodo[completedTodoTitle] = state.getIn(['todos', completedTodoTitle]);
  const interimState = state.mergeIn(['completedTodos'], completedTodo);
  const nextState = interimState.deleteIn(['todos', completedTodoTitle]);

  if (completedTodoTitle === state.get('nextTask')){
    return nextTask(nextState);
  } else {
    const list = nextState.get('list');
    return nextState.merge({'list': list.delete(list.indexOf(completedTodoTitle))});
  }
}

export function editTodo(state, todo, {
                                        title, 
                                        context = state.getIn(['todos', todo, 'context']), 
                                        priority = state.getIn(['todos', todo, 'priority']), 
                                        deadline = state.getIn(['todos', todo, 'deadline']), 
                                        time = state.getIn(['todos', todo, 'time'])
                                      }){
  const todos = state.get('todos');
  const todoDetails = state.getIn(['todos', todo]);

  let interimState;
  if(title){
    const list = state.get('list');
    const nextTodo = state.get('nextTask') === todo ? title : state.get('nextTask');

    const interimTodos = todos.delete(todo);
    const newTodo = {};
    newTodo[title] = todoDetails;
    const newTodos = interimTodos.merge(newTodo);

    const newList = list.splice(list.indexOf(todo),1, title);
    
    interimState = state.merge({
      todos: newTodos,
      list: newList,
      nextTask : nextTodo
    })
  }
  const finalState = interimState ? interimState : state;
  return finalState.mergeIn(['todos', title? title : todo], {context, priority, deadline, time});
}

import {INITIAL_STATE, setState, addTodo, completeTodo, editTodo, splitTodo} from './core'

export default function reducer(state = INITIAL_STATE, action){
  switch (action.type) {
    case 'SET_STATE' : return setState(state, action.todos);
    case 'ADD_TODO': return addTodo(state, action.todo);
    case 'COMPLETE_TODO': return completeTodo(state, action.todo);
    case 'EDIT_TODO': return editTodo(state, action.todo, action.details);
    case 'SPLIT_TODO': return splitTodo(state, action.todo, action.date);
  }
  return state;
};
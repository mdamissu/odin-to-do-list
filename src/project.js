export default function Project(name) {
  let todos = [];
  return {
    name,
    addTodo(todo) { todos.push(todo); },
    removeTodo(index) { todos.splice(index, 1); },
    getTodos() { return todos; },
    setTodos(newTodos) { todos = newTodos; }
  };
}

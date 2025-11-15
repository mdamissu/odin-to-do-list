function saveProjects(projects){
  const data = projects.map(p=>({ name: p.name, todos: p.getTodos() }));
  localStorage.setItem('projects', JSON.stringify(data));
}

function loadProjects(ProjectClass, TodoClass){
  const data = localStorage.getItem('projects');
  if(!data) return [];
  return JSON.parse(data).map(pData=>{
    const proj = new ProjectClass(pData.name);
    pData.todos.forEach(td=>{
      const todo = new TodoClass(td.title, td.description, td.dueDate, td.priority);
      todo.completed = td.completed;
      todo.notes = td.notes || '';
      todo.checklist = td.checklist || [];
      proj.addTodo(todo);
    });
    return proj;
  });
}

export { saveProjects, loadProjects };

import { getProjects, getProjectByName, createProject } from './logic.js';
import { saveProjects, loadProjects } from './storage.js';
import Todo from './todo.js';
import Project from './project.js';

function renderProjectForm(){
  const content = document.getElementById('content');
  const form = document.createElement('form');
  form.innerHTML = `<h3>Create Project</h3>
    <input name="projectName" placeholder="Project name" required>
    <button>Add Project</button><hr>`;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = form.projectName.value;
    if(name){
      createProject(name, Project);
      saveProjects(getProjects());
      renderProjects();
      renderAddTodoForm();
    }
  });
  content.appendChild(form);
}

function renderAddTodoForm(){
  const content = document.getElementById('content');
  const form = document.createElement('form');
  form.innerHTML = `<h3>Add Todo</h3>
    <select name="project">${getProjects().map(p=>`<option>${p.name}</option>`).join('')}</select>
    <input name="title" placeholder="Todo title" required>
    <input name="desc" placeholder="Description">
    <input type="date" name="dueDate" required>
    <select name="priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <button>Add Todo</button><hr>`;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const project = getProjectByName(form.project.value);
    const todo = new Todo(form.title.value, form.desc.value, form.dueDate.value, form.priority.value);
    project.addTodo(todo);
    saveProjects(getProjects());
    renderProjects();
  });
  content.appendChild(form);
}

function renderProjects(){
  const content = document.getElementById('content');
  content.querySelectorAll('.project').forEach(p=>p.remove());

  getProjects().forEach(project=>{
    const div = document.createElement('div');
    div.classList.add('project');
    div.setAttribute('data-project', project.name);
    div.innerHTML = `<h2>${project.name}</h2>`;

    const todos = project.getTodos().sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));

    todos.forEach((todo,index)=>{
      const item = document.createElement('div');
      item.classList.add('todo-item');
      item.setAttribute('draggable','true');
      item.dataset.index=index;

      item.innerHTML = `
        <span contenteditable="true" class="editable ${todo.priority}" style="text-decoration:${todo.completed?'line-through':'none'}">${todo.title}</span>
        <button class="complete-btn">✔</button>
        <button class="delete-btn">🗑</button>
        <button class="notes-btn">📝</button>
        <button class="checklist-btn">✅</button>
        <div class="notes" style="margin-left:20px;font-style:italic">${todo.notes}</div>
        <ul class="checklist" style="margin-left:20px;"></ul>
      `;

      // Complete
      item.querySelector('.complete-btn').addEventListener('click', ()=>{
        todo.completed = !todo.completed;
        saveProjects(getProjects());
        renderProjects();
      });

      // Delete
      item.querySelector('.delete-btn').addEventListener('click', ()=>{
        project.removeTodo(index);
        saveProjects(getProjects());
        renderProjects();
      });

      // Inline edit
      item.querySelector('.editable').addEventListener('blur', e=>{
        todo.title = e.target.textContent;
        saveProjects(getProjects());
      });

      // Notes
      item.querySelector('.notes-btn').addEventListener('click', ()=>{
        const note = prompt('Enter notes', todo.notes);
        if(note!==null){
          todo.notes=note;
          saveProjects(getProjects());
          renderProjects();
        }
      });

      // Checklist
      item.querySelector('.checklist-btn').addEventListener('click', ()=>{
        const text = prompt('Add checklist item');
        if(text){
          todo.checklist.push({text, done:false});
          saveProjects(getProjects());
          renderProjects();
        }
      });

      // Render checklist
      const ul = item.querySelector('.checklist');
      todo.checklist.forEach((c,i)=>{
        const li = document.createElement('li');
        li.innerHTML=`<input type="checkbox" ${c.done?'checked':''}> ${c.text} <button class="del-check">🗑</button>`;
        li.querySelector('input').addEventListener('change', e=>{
          c.done = e.target.checked;
          saveProjects(getProjects());
        });
        li.querySelector('.del-check').addEventListener('click', ()=>{
          todo.checklist.splice(i,1);
          saveProjects(getProjects());
          renderProjects();
        });
        ul.appendChild(li);
      });

      // Drag & Drop
      item.addEventListener('dragstart', e=>{
        e.dataTransfer.setData('text/plain', index);
      });
      item.addEventListener('dragover', e=>{ e.preventDefault(); });
      item.addEventListener('drop', e=>{
        e.preventDefault();
        const from = e.dataTransfer.getData('text/plain');
        const to = index;
        const todos = project.getTodos();
        const [moved] = todos.splice(from,1);
        todos.splice(to,0,moved);
        project.setTodos(todos);
        saveProjects(getProjects());
        renderProjects();
      });

      div.appendChild(item);
    });

    // Filter / Sort UI
    const filterSortDiv = document.createElement('div');
    filterSortDiv.innerHTML = `
      <label>Filter: 
        <select class="filter">
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>Sort by Due Date: 
        <select class="sort">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label><hr>`;
    filterSortDiv.querySelector('.filter').addEventListener('change', e=>{
      const val = e.target.value;
      div.querySelectorAll('.todo-item').forEach(it=>{
        if(val==='all'||it.querySelector('span').classList.contains(val)) it.style.display='flex';
        else it.style.display='none';
      });
    });
    filterSortDiv.querySelector('.sort').addEventListener('change', e=>{
      const val = e.target.value;
      const items = Array.from(div.querySelectorAll('.todo-item'));
      items.sort((a,b)=>{
        const da = new Date(a.querySelector('span').textContent);
        const db = new Date(b.querySelector('span').textContent);
        return val==='asc'?da-db:db-da;
      });
      items.forEach(it=>div.appendChild(it));
    });
    div.prepend(filterSortDiv);

    content.appendChild(div);
  });
}

export { renderProjectForm, renderAddTodoForm, renderProjects };

import './styles.css';
import Todo from './todo.js';
import Project from './project.js';
import { addProject, getProjects, createProject } from './logic.js';
import { renderProjectForm, renderAddTodoForm, renderProjects } from './dom.js';
import { saveProjects, loadProjects } from './storage.js';

// Load from localStorage
const loadedProjects = loadProjects(Project, Todo);
loadedProjects.forEach(p=>addProject(p));
if(getProjects().length===0) createProject('Home');

renderProjectForm();
renderAddTodoForm();
renderProjects();

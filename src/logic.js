import Project from './project.js';

const projects = [];

function addProject(project) { projects.push(project); }
function getProjects() { return projects; }
function getProjectByName(name) { return projects.find(p => p.name === name); }
function createProject(name, ProjectClass = Project) {
  const project = new ProjectClass(name);
  addProject(project);
  return project;
}

export { addProject, getProjects, getProjectByName, createProject };

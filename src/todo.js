export default function Todo(title, description, dueDate, priority) {
  return {
    title,
    description,
    dueDate,
    priority, // low / medium / high
    completed: false,
    notes: '',
    checklist: [], // {text, done}
  };
}
// Une todo-list minimale, en mémoire.
// C'est le terrain de jeu : volontairement simple. Le workshop consiste à faire
// évoluer ce module via un change OpenSpec (voir README.md).

let tasks = [];
let nextId = 1;

/** Réinitialise l'état (utile pour les tests). */
export function reset() {
  tasks = [];
  nextId = 1;
}

/** Ajoute une tâche non terminée et la retourne. */
export function addTask(title) {
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("title is required");
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  return { ...task };
}

/** Retourne une copie de la liste des tâches, dans l'ordre d'ajout. */
export function listTasks() {
  return tasks.map((t) => ({ ...t }));
}

/** Marque une tâche comme terminée. */
export function completeTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`unknown task ${id}`);
  }
  task.done = true;
  return { ...task };
}

/** Supprime une tâche. */
export function removeTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`unknown task ${id}`);
  }
  tasks.splice(index, 1);
}

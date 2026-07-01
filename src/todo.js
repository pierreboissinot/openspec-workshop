// Une todo-list minimale, en mémoire.
// C'est le terrain de jeu : volontairement simple. Le workshop consiste à faire
// évoluer ce module via un change OpenSpec (voir README.md).

let tasks = [];
let nextId = 1;

// Niveaux d'importance : le rang sert à la fois au tri (high avant medium avant
// low) et de liste blanche pour la validation — une seule source de vérité.
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/** Lève une erreur explicite si la priorité n'est pas un niveau connu. */
function assertValidPriority(priority) {
  if (!Object.prototype.hasOwnProperty.call(PRIORITY_ORDER, priority)) {
    throw new Error("invalid priority: " + priority);
  }
}

/** Réinitialise l'état (utile pour les tests). */
export function reset() {
  tasks = [];
  nextId = 1;
}

/**
 * Ajoute une tâche non terminée et la retourne.
 * La priorité est optionnelle (défaut "medium") ; une valeur invalide lève une
 * erreur sans rien ajouter.
 */
export function addTask(title, priority = "medium") {
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("title is required");
  }
  assertValidPriority(priority);
  const task = { id: nextId++, title: title.trim(), done: false, priority };
  tasks.push(task);
  return { ...task };
}

/**
 * Change la priorité d'une tâche existante et retourne une copie de la tâche.
 * Priorité invalide → erreur, état inchangé. Id inconnu → erreur.
 */
export function setPriority(id, priority) {
  assertValidPriority(priority);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`unknown task ${id}`);
  }
  task.priority = priority;
  return { ...task };
}

/**
 * Retourne une copie de la liste des tâches, triée par importance décroissante
 * (high → medium → low). Tri stable : à priorité égale, l'ordre d'ajout est
 * conservé (Array.prototype.sort est stable depuis Node 11).
 */
export function listTasks() {
  return tasks
    .map((t) => ({ ...t }))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
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

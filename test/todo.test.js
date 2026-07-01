import { test } from "node:test";
import assert from "node:assert/strict";

import {
  reset,
  addTask,
  listTasks,
  completeTask,
  removeTask,
} from "../src/todo.js";

test("addTask crée une tâche non terminée", () => {
  reset();
  const task = addTask("Acheter du café");
  assert.equal(task.title, "Acheter du café");
  assert.equal(task.done, false);
  assert.equal(listTasks().length, 1);
});

test("addTask refuse un titre vide", () => {
  reset();
  assert.throws(() => addTask("   "), /title is required/);
});

test("completeTask marque la tâche comme terminée", () => {
  reset();
  const task = addTask("Écrire la spec");
  completeTask(task.id);
  assert.equal(listTasks()[0].done, true);
});

test("completeTask échoue sur un id inconnu", () => {
  reset();
  assert.throws(() => completeTask(999), /unknown task 999/);
});

test("removeTask supprime la tâche", () => {
  reset();
  const task = addTask("Tâche jetable");
  removeTask(task.id);
  assert.equal(listTasks().length, 0);
});

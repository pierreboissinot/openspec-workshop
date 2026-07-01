import { test } from "node:test";
import assert from "node:assert/strict";

import {
  reset,
  addTask,
  listTasks,
  setPriority,
} from "../src/todo.js";

test("addTask sans priorité → priorité medium par défaut", () => {
  reset();
  const task = addTask("Acheter du café");
  assert.equal(task.priority, "medium");
  assert.equal(listTasks()[0].priority, "medium");
});

test("addTask avec une priorité explicite valide", () => {
  reset();
  const task = addTask("Rendre le rapport", "high");
  assert.equal(task.priority, "high");
});

test("listTasks trie par priorité décroissante (high → medium → low)", () => {
  reset();
  addTask("A", "low");
  addTask("B", "high");
  addTask("C", "medium");
  assert.deepEqual(
    listTasks().map((t) => t.title),
    ["B", "C", "A"],
  );
});

test("listTasks : ex æquo stable, ordre d'ajout conservé", () => {
  reset();
  addTask("X", "high");
  addTask("Y", "low");
  addTask("Z", "high");
  assert.deepEqual(
    listTasks().map((t) => t.title),
    ["X", "Z", "Y"],
  );
});

test("addTask avec une priorité invalide → erreur, état inchangé", () => {
  reset();
  assert.throws(() => addTask("Tâche", "urgent"), /invalid priority: urgent/);
  assert.equal(listTasks().length, 0);
});

test("setPriority change la priorité d'une tâche existante", () => {
  reset();
  const task = addTask("Écrire la spec");
  const updated = setPriority(task.id, "high");
  assert.equal(updated.priority, "high");
  assert.equal(listTasks()[0].priority, "high");
});

test("setPriority avec une priorité invalide → erreur, état inchangé", () => {
  reset();
  const task = addTask("Tâche"); // medium par défaut
  assert.throws(() => setPriority(task.id, "urgent"), /invalid priority: urgent/);
  assert.equal(listTasks()[0].priority, "medium");
});

test("setPriority sur un id inconnu → erreur", () => {
  reset();
  assert.throws(() => setPriority(999, "high"), /unknown task 999/);
});

## 1. Modèle et validation

- [ ] 1.1 Définir `PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }` dans `src/todo.js` (rang de tri + liste blanche)
- [ ] 1.2 Ajouter une fonction interne `assertValidPriority(priority)` qui lève `Error("invalid priority: " + priority)` si la valeur n'est pas une clé de `PRIORITY_ORDER`

## 2. Création et modification de priorité

- [ ] 2.1 Étendre `addTask(title, priority = "medium")` : valider la priorité avant toute mutation, stocker `priority` sur la tâche, préserver l'appel historique `addTask(title)`
- [ ] 2.2 Ajouter `setPriority(id, priority)` : valider d'abord, retrouver la tâche par `id` (sinon `Error("unknown task <id>")`), puis affecter la nouvelle priorité et retourner une copie de la tâche

## 3. Tri par importance

- [ ] 3.1 Faire trier `listTasks()` par `PRIORITY_ORDER[priority]` (high → medium → low), tri stable, sur une copie — l'ordre d'ajout est conservé à priorité égale

## 4. Tests

- [ ] 4.1 Ajouter les tests node:test dans `test/` : défaut `medium`, priorité explicite à l'ajout, tri high→medium→low, ex æquo stable, invalide à l'ajout (état inchangé), invalide au `setPriority` (état inchangé), `setPriority` réussi, `id` inconnu
- [ ] 4.2 Lancer `npm test` : tous les tests (anciens + nouveaux) sont au vert

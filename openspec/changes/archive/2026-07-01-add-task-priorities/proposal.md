## Why

Aujourd'hui toutes les tâches se valent : `listTasks()` les rend dans l'ordre
d'ajout, sans notion d'importance. L'utilisateur ne peut ni marquer ce qui
compte vraiment, ni le retrouver en premier — l'essentiel se noie dans la liste.

## What Changes

- Chaque tâche porte une **priorité** parmi trois niveaux : `high`, `medium`, `low`.
- `addTask(title, priority?)` accepte une priorité optionnelle. Sans argument, la
  tâche est créée en `medium` (défaut). L'appel historique `addTask("titre")`
  continue de fonctionner — **non-breaking**.
- Nouvelle fonction `setPriority(id, priority)` pour changer la priorité d'une
  tâche existante.
- `listTasks()` trie désormais **high → medium → low**, en **tri stable** : à
  priorité égale, l'ordre d'ajout est conservé.
- Une priorité hors des trois niveaux lève `Error("invalid priority: ...")` et
  **laisse l'état inchangé** (que ce soit à l'ajout ou via `setPriority`).

## Capabilities

### New Capabilities
- `task-priorities`: attribuer un niveau d'importance à une tâche, le modifier,
  et lister les tâches par importance décroissante (tri stable).

### Modified Capabilities
<!-- Aucune : la todo-list de base n'a pas de spec OpenSpec existante à modifier. -->

## Non-Goals

- Pas de priorité numérique libre ni de niveaux configurables : exactement trois
  niveaux figés.
- Pas de persistance : l'état reste en mémoire, comme le reste de l'app.
- Pas de tri secondaire par titre, date ou statut `done` : seul le couple
  (priorité, ordre d'ajout) ordonne la liste.
- Pas de filtrage par priorité dans cette itération (uniquement le tri).

## Impact

- Code : `src/todo.js` (structure de tâche + `addTask`, `listTasks`, nouvelle
  `setPriority`).
- Tests : nouveaux cas node:test dans `test/`.
- API : signature de `addTask` étendue (rétrocompatible) ; ajout de `setPriority` ;
  comportement de `listTasks` modifié (ordre). Aucune dépendance ajoutée.

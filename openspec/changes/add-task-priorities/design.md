## Context

`src/todo.js` est une todo-list en mémoire (ESM, sans dépendance). Une tâche est
`{ id, title, done }` et `listTasks()` rend une copie dans l'ordre d'ajout. Le
besoin ajoute une notion d'importance et un tri « ce qui compte d'abord ». On
tranche ici les décisions techniques laissées ouvertes par le besoin flou, pour
que l'implémentation soit mécanique et testable.

## Goals / Non-Goals

**Goals:**
- Modéliser une priorité à trois niveaux, avec un défaut clair.
- Trier `listTasks()` par importance sans perdre l'ordre d'ajout à égalité.
- Rester rétrocompatible : `addTask("titre")` ne doit pas casser.
- Erreurs explicites et déterministes, sans effet de bord en cas d'invalide.

**Non-Goals:**
- Niveaux configurables ou priorité numérique libre.
- Persistance, filtrage, ou tri secondaire (titre/date/`done`).

## Decisions

- **Trois niveaux figés `high` / `medium` / `low`, défaut `medium`.**
  Représentés par des chaînes plutôt que des entiers : lisibles dans les tests et
  dans l'objet tâche, et directement conformes au vocabulaire du besoin. Un objet
  `PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }` sert de rang pour le tri et de
  liste blanche pour la validation (une seule source de vérité).
  _Alternative rejetée_ : entiers 1..3 → plus compacts mais moins lisibles et
  exposent un détail d'implémentation dans l'API publique.
  _Alternative rejetée_ : défaut `low` → enterrerait les tâches non qualifiées ;
  `medium` est un milieu neutre qui ne fausse pas le tri.

- **Validation centralisée + état inchangé en cas d'invalide.**
  Une fonction interne `assertValidPriority(p)` lève `Error("invalid priority: "
  + p)` avant toute mutation. À l'ajout comme au `setPriority`, on valide d'abord,
  on mute ensuite : aucune tâche partielle, aucune priorité écrasée si l'entrée
  est mauvaise.
  _Alternative rejetée_ : normaliser silencieusement une valeur inconnue vers
  `medium` → masque les fautes de frappe de l'appelant, comportement non
  déterministe côté produit.

- **`addTask(title, priority = "medium")`.**
  Paramètre optionnel avec valeur par défaut : la signature historique reste
  valide et l'ajout est rétrocompatible.
  _Alternative rejetée_ : fonction séparée `addTaskWithPriority` → duplication
  inutile pour une app volontairement minimale.

- **`setPriority(id, priority)` pour la modification.**
  Fonction dédiée, symétrique de `completeTask`. Réutilise `assertValidPriority`
  puis la même recherche par `id` que l'existant ; `id` inconnu → `Error("unknown
  task <id>")`, cohérent avec `completeTask`/`removeTask`.

- **Tri stable via `Array.prototype.sort` sur le rang de priorité.**
  Depuis Node 11, `sort` est garanti stable : trier une copie par
  `PRIORITY_ORDER[priority]` suffit à obtenir high→medium→low tout en conservant
  l'ordre d'ajout à égalité. `listTasks()` continue de rendre des copies.
  _Alternative rejetée_ : décorer d'un index d'ajout puis trier sur (rang, index)
  → superflu puisque la stabilité est déjà garantie par le runtime ciblé.

## Risks / Trade-offs

- Changer l'ordre de `listTasks()` modifie un comportement observable → Mitigation :
  documenté dans la spec et couvert par des tests dédiés (tri + ex æquo stable).
- Stabilité dépendante du runtime → Mitigation : Node >= 18 (le prérequis du
  projet) garantit un `sort` stable ; aucun polyfill requis.
- Introduire un champ `priority` sur l'objet tâche pourrait surprendre du code
  existant → Mitigation : ajout purement additif, aucun champ retiré ni renommé.

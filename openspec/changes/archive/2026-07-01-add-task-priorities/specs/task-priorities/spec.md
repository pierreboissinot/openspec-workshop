## ADDED Requirements

### Requirement: Priorité par défaut à la création

Une tâche créée sans priorité explicite SHALL recevoir la priorité `medium`.

#### Scenario: Ajout sans priorité

- **WHEN** on appelle `addTask("Acheter du café")` sans second argument
- **THEN** la tâche créée a une propriété `priority` égale à `"medium"`

### Requirement: Priorité explicite à la création

`addTask(title, priority)` SHALL accepter une priorité parmi `high`, `medium`,
`low` et l'affecter à la tâche créée. L'appel historique `addTask(title)` SHALL
continuer de fonctionner sans changement.

#### Scenario: Ajout avec une priorité valide

- **WHEN** on appelle `addTask("Rendre le rapport", "high")`
- **THEN** la tâche créée a une propriété `priority` égale à `"high"`

#### Scenario: Priorité invalide à la création

- **GIVEN** la liste des tâches est vide
- **WHEN** on appelle `addTask("Tâche", "urgent")`
- **THEN** un `Error` dont le message commence par `invalid priority:` est levé
- **AND** aucune tâche n'est ajoutée (l'état reste inchangé)

### Requirement: Modifier la priorité d'une tâche existante

`setPriority(id, priority)` SHALL remplacer la priorité de la tâche identifiée
par `id` par une valeur parmi `high`, `medium`, `low`.

#### Scenario: Changement de priorité réussi

- **GIVEN** une tâche existante créée en `medium`
- **WHEN** on appelle `setPriority(id, "high")` avec l'`id` de cette tâche
- **THEN** la priorité de la tâche vaut désormais `"high"`

#### Scenario: Priorité invalide au changement

- **GIVEN** une tâche existante créée en `medium`
- **WHEN** on appelle `setPriority(id, "urgent")` avec l'`id` de cette tâche
- **THEN** un `Error` dont le message commence par `invalid priority:` est levé
- **AND** la priorité de la tâche reste `"medium"` (l'état est inchangé)

#### Scenario: Identifiant inconnu

- **WHEN** on appelle `setPriority(999, "high")` pour un `id` qui n'existe pas
- **THEN** un `Error` signalant une tâche inconnue est levé

### Requirement: Tri des tâches par importance

`listTasks()` SHALL retourner les tâches triées par priorité décroissante,
`high` avant `medium` avant `low`. Le tri SHALL être **stable** : deux tâches de
même priorité conservent leur ordre d'ajout.

#### Scenario: Tri par priorité décroissante

- **GIVEN** trois tâches ajoutées dans l'ordre : "A" en `low`, "B" en `high`, "C" en `medium`
- **WHEN** on appelle `listTasks()`
- **THEN** l'ordre des titres retournés est `["B", "C", "A"]`

#### Scenario: Ex æquo stable par ordre d'ajout

- **GIVEN** trois tâches ajoutées dans l'ordre : "X" en `high`, "Y" en `low`, "Z" en `high`
- **WHEN** on appelle `listTasks()`
- **THEN** l'ordre des titres retournés est `["X", "Z", "Y"]` (X avant Z car ajouté en premier)

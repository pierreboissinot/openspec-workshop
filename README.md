# OpenSpec — Terrain de jeu (workshop Agile Nantes)

> **OpenSpec aide toi et ton agent de code à t'accorder sur _quoi_ construire
> avant d'écrire la moindre ligne de code.**

L'idée du soir : **prendre OpenSpec en main sur un vrai petit repo**, pas écouter
un REX descendant. Vous partez d'une app todo minimale et d'un besoin produit
**volontairement flou**. À vous de le transformer en spec claire — puis en code —
avec votre agent.

> Le fil rouge du workshop : _« L'IA ne comble rien. Elle amplifie ce qu'elle
> reçoit. »_ Un besoin flou donne du code massif dans la mauvaise direction.

---

## Prérequis

- **Node.js ≥ 18** (`node --version`)
- **Un agent de code** au choix : Claude Code, Cursor, GitHub Copilot… (ce repo est déjà configuré pour les trois — voir `.claude/`, `.cursor/`, `.github/`)
- **OpenSpec CLI** :
  ```bash
  npm install -g @fission-ai/openspec@latest
  openspec --version   # >= 1.4.1
  ```

## Mise en route

```bash
# Récupérez le repo, puis :
npm test        # (ou `node --test`) — 5 tests au vert : l'app de départ fonctionne
```

## Le terrain de jeu

Une todo-list en mémoire, dans `src/todo.js` :

| Fonction | Rôle |
| --- | --- |
| `addTask(title)` | Ajoute une tâche non terminée |
| `listTasks()` | Liste les tâches, dans l'ordre d'ajout |
| `completeTask(id)` | Marque une tâche comme terminée |
| `removeTask(id)` | Supprime une tâche |

Rien de plus. C'est **volontaire** : le sujet du workshop, c'est la **façon de
spécifier**, pas la richesse de l'app.

---

## La mission

Le Produit arrive avec ce besoin — tel quel :

> **« En tant qu'utilisateur, je veux indiquer l'importance de mes tâches et
> retrouver en premier ce qui compte vraiment, pour ne pas noyer l'essentiel. »**

C'est flou **exprès**. Avant, un humain comblait les trous. Un agent, non : il
prendra une décision à votre place (souvent la mauvaise) si vous ne clarifiez pas.

**Votre travail : transformer ce besoin flou en un change OpenSpec propre, puis
laisser l'agent l'implémenter — dans un cadre que vous maîtrisez.**

Nom du change : `add-task-priorities`.

---

## Le workflow en 4 temps

OpenSpec structure le travail en 4 artefacts (tous en Markdown, versionnés en git) :

- **`proposal.md`** — le pourquoi et le quoi (périmètre, non-goals)
- **`specs/`** — la delta spec : `ADDED` / `MODIFIED` / `REMOVED` en Given/When/Then
- **`design.md`** — le comment (décisions techniques, alternatives rejetées)
- **`tasks.md`** — la checklist d'implémentation

…via 4 commandes :

### 1. Explorer (optionnel mais recommandé) — clarifier le besoin

Un temps de réflexion **avant** de figer quoi que ce soit.

- **Claude Code** : `/opsx:explore`
- **Cursor** : `/opsx-explore`
- **Copilot** : prompt `/opsx-explore`
- **Tout agent** (copier-coller) :
  > _« On utilise le workflow OpenSpec de ce repo. Aide-moi à clarifier ce besoin
  > avant d'écrire une spec : "je veux indiquer l'importance de mes tâches et voir
  > en premier ce qui compte". Pose-moi les questions ouvertes qui manquent. »_

### 2. Proposer — générer les artefacts

- **Claude Code** : `/opsx:propose add-task-priorities`
- **Cursor** : `/opsx-propose add-task-priorities`
- **Copilot** : prompt `/opsx-propose` (`add-task-priorities`)
- **Tout agent** :
  > _« Avec le workflow OpenSpec de ce repo, crée un change nommé
  > `add-task-priorities` pour ce besoin : <colle la user story>. Génère
  > `proposal.md`, la delta spec, `design.md` et `tasks.md`. **Pose-moi les
  > questions nécessaires** et attends ma validation avant d'implémenter. »_

**À observer :**
```bash
openspec list                         # le change apparaît
openspec show add-task-priorities     # résumé
openspec validate add-task-priorities # conforme au schéma ?
git status                            # les nouveaux .md créés
```
Ouvrez `openspec/changes/add-task-priorities/` et **lisez** ce que l'agent propose.
C'est le moment clé : on relit une spec, pas des centaines de lignes de code.

### 3. Implémenter — l'agent code dans le cadre

- **Claude Code** : `/opsx:apply` · **Cursor** : `/opsx-apply` · **Copilot** : `/opsx-apply`
- **Tout agent** :
  > _« Implémente les tâches de `add-task-priorities` une par une, en cochant
  > `tasks.md` au fur et à mesure. Ajoute les tests. »_

**À observer :**
```bash
npm test              # les nouveaux tests passent
git diff src/         # le code écrit, dans un périmètre défini
```
Les cases de `tasks.md` se cochent (`- [ ]` → `- [x]`).

### 4. Archiver — la spec devient la source de vérité

- **Claude Code** : `/opsx:archive` · **Cursor** : `/opsx-archive` · **Copilot** : `/opsx-archive`
- **Tout agent** :
  > _« Archive le change `add-task-priorities` : fusionne la delta spec dans les
  > specs principales et déplace le change dans l'archive. »_
- **En CLI directe** : `openspec archive add-task-priorities -y` (le `-y` saute la confirmation interactive — sans lui, la commande attend une réponse).

**À observer :**
```bash
openspec list --specs                 # la capacité "priorités" existe désormais
git status                            # openspec/specs/ mis à jour, change archivé
```
La spec vit maintenant dans `openspec/specs/` : c'est la **documentation vivante**,
versionnée avec le code, lisible par un humain **et** par le prochain agent.

---

## Questions à poser au PO (pour clarifier le besoin)

Si votre agent ne les pose pas, questionner le métier et reporter les réponses à l'agent — c'est tout l'exercice :

- Combien de niveaux d'importance ? (haute/moyenne/basse ? un nombre ?)
- Quel est le niveau **par défaut** quand on ne précise rien ?
- Comment on **trie** ? Que fait-on des **ex æquo** ?
- Peut-on **changer** l'importance d'une tâche existante ?
- Les valeurs invalides : on **rejette** comment ?
- Est-ce que ça change la signature de `listTasks()` ou on ajoute une fonction ?

## Terminé quand…

- [ ] `proposal.md`, delta `specs/`, `design.md`, `tasks.md` existent et sont cohérents
- [ ] `openspec validate add-task-priorities` passe
- [ ] `npm test` est vert (avec de **nouveaux** tests sur les priorités)
- [ ] le change est **archivé** et `openspec/specs/` contient la nouvelle capacité
- [ ] dans la spec archivée, le `## Purpose` (mis à `TBD` par l'outil) est complété
- [ ] vous pouvez expliquer, en relisant la spec, **pourquoi** chaque décision a été prise

---

## Bonus (si vous allez vite)

- **Un autre besoin** : « une échéance par tâche, et voir celles en retard », ou
  « des étiquettes pour filtrer ». Refaites une boucle explore → archive.
- **Changez d'agent — l'angle souverain** : OpenSpec est agnostique. Un seul
  `openspec init --tools <agent>` reconfigure le même workflow. La liste inclut
  **`vibe` (Mistral Vibe)** — de quoi rester sur une stack souveraine sans rien
  réapprendre :
  ```bash
  openspec init --tools vibe
  ```
  Les specs, elles, ne changent pas : c'est du Markdown, pas du lock-in.

## Debrief

- L'agent a-t-il **comblé** les trous tout seul, ou **demandé** ?
- Vous avez relu une **spec** ou du **code** ?
- **Vous vous voyez l'utiliser** dans votre équipe ? Où ça coincerait ?

## Ressources

- Site : <https://openspec.dev>
- Dépôt : <https://github.com/Fission-AI/OpenSpec>
- Getting started : <https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md>

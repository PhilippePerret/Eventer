~~~markdown
# Eventer — état ACTUEL réel du projet

## IMPORTANT

Le projet est actuellement dans une phase de refactorisation INACHEVÉE.

Il ne faut PAS repartir de vieilles versions mentales du code.

Le dernier état réel est :

- introduction d’une classe générique `Panel`
- introduction de :
  - `EventsPanel`
  - `BrinsPanel`
  - `PersosPanel`
- mais migration NON terminée.

Le projet est donc dans un état hybride partiellement cassé.

---

# Philosophie du projet

Application locale d’évènemencier narratif.

Objectif :
- outil littéraire,
- clavier-first,
- très fluide,
- très sobre,
- très peu de chrome,
- pas “webapp moderne”.

L’écriture du manuscrit se fait ailleurs :
- LibreOffice
- Typora
- Scrivener
etc.

Eventer sert seulement à :
- organiser les événements,
- déplacer,
- relier,
- filtrer,
- manipuler la structure narrative.

------

# Ce qu’il faut faire MAINTENANT

## PRIORITÉ ABSOLUE

Stabiliser :

- `Panel`
- `EventsPanel`

AVANT de reconnecter :

- `BrinsPanel`
- `PersosPanel`

Sinon :

- duplication,
- états contradictoires,
- handlers incohérents,
- bugs de focus partout.

------

# IMPORTANT

Le précédent assistant avait tendance à :

- oublier l’état actuel réel des fichiers,
- proposer des changements déjà faits,
- mélanger anciennes et nouvelles architectures,
- corriger localement au lieu de finir l’abstraction.

```

```
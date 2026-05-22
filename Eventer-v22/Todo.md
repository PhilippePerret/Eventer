# Todo list

* Faire l'évènemencier de départ avec évènements/brins/personnages minimum

* pouvoir verrouiller les évènements (ne pas les déplacer (sauf de façon indirecte quand ils sont « poussés » par d’autres évènements)

* **Un évènement peut posséder son évènemencier**, ça permet d’imbriquer les évènemenciers, mais attention, ils s’ouvrent toujours de façon séparée,

  * juste un mode exceptionnel qui permet d‘afficher toutes les imbrications, mais sans modification possible.

  => une propriété `child` qui conduit à l’évènemencier enfant d’un évènement et une propriété `parent` qui conduit à l’évènemencier parent.

  * => une touche « E » qui permet d’éditer l’évènement enfant de l’évènement (s’il existe) — note : *E* veut aussi bien dire « Enfant » que « Évènemencier » (Events)
  * => une touche « P » qui permet de revenir à l’évènementier parent (s’il existe)
  * => Dans le mode d’emploi, on dira qu’on peut commencer par faire les quatres grandes parties de l’histoire : Exposition, Développement avant milieu, Développement après milieu, Dénouement final. Puis on crée les évènements pour chaque partie en entrant dedans « E »
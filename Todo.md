# Todo list

* un script unique pour tout lancer (Web App Safari + sinatra)
* la possibilité d’exporter, avec possibilité de définir les niveaux à exporter
* Utilisation de l’eventer à mettre en avant : au final, il peut produire le texte même du roman ou du scénario : on fait l’event de premier niveau (expo, dév avant milieu etc.) dans l’event de second niveau, on fait les séquences, 3e niveau les scènes, 4e niveau les temps (beat) de scènes, 5e niveau (optionnel) les actions/dialogues et 6e et derniers niveau, le texte, où chaque chaque évènement est un paragraphe du texte

  * il faudrait pouvoir définir que le projet est un scénario : gestion particulière du dernier niveau
  * il faudrait pouvoir définir quel est le niveau « texte » (ou « texte final ») pour modifier le comportement de l’affichage :
    * plusieurs lignes possibles (n’est-ce pas déjà le cas ?)
    * mise en forme particulière quand c’est un scénario
    * => il faut pouvoir définir le type du niveau texte, donc, peut-être que l’évènemencier soit de type « roman » ou « scénario » (=> dernier niveau)
    * Ne pas pouvoir faire des évènemenciers des évènements (ou si, mais ce seront forcément des textes aussi)
    * => si un paragraphe a un évènemencier, il « imprime » ses enfants, pas lui-même — en boucle
* mise en forme

  * remplacement des badges personnages par leur pseudo (donc recherche dans le texte de `\b[A-Z]{2}\b]` et remplacement.
  * mise en forme markdown-like 
  * => distinction entre texte en édition et texte imprimé
* Faire l'évènemencier de départ avec 1 évènement/aide, 1 brin/aide, 1 personnage/aide
* Pouvoir créer un nouveau projet (Cmd N)
  - retour au panneau d'accueil
  - création du nouveau projet (dans la liste et physiquement)
* Pouvoir ordonner l'affichage des projets (donc un fichier pour conserver ça)

* pouvoir verrouiller les évènements (ne pas les déplacer (sauf de façon indirecte quand ils sont « poussés » par d’autres évènements)

* **Un évènement peut posséder son évènemencier**, ça permet d’imbriquer les évènemenciers, mais attention, ils s’ouvrent toujours de façon séparée,

  * juste un mode exceptionnel qui permet d‘afficher toutes les imbrications, mais sans modification possible.

  => une propriété `child` qui conduit à l’évènemencier enfant d’un évènement et une propriété `parent` qui conduit à l’évènemencier parent.

  * => une touche « E » qui permet d’éditer l’évènement enfant de l’évènement (s’il existe) — note : *E* veut aussi bien dire « Enfant » que « Évènemencier » (Events)
  * => une touche « P » qui permet de revenir à l’évènementier parent (s’il existe)
  * => Dans le mode d’emploi, on dira qu’on peut commencer par faire les quatres grandes parties de l’histoire : Exposition, Développement avant milieu, Développement après milieu, Dénouement final. Puis on crée les évènements pour chaque partie en entrant dedans « E »
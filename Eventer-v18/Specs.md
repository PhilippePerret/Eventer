# Eventer

## Philosophie

- outil local
- aucune complexité inutile
- interface silencieuse
- priorité absolue à la fluidité
- zéro sensation “base de données”

---

## Spécifications

* Application ruby Sinatra (cf. app.rb)
* l’enregistrement est automatique, transparent



---

## Architecture

```text
Eventer/
│
├── app.rb
│
├── data/
│   └── evenements.json
│
├── public/
│		├── classes/
│		│		├── panels/
│		│		│		├── panels.js
│		│		│		├── EventsPanels.js
│		│		│		├── BrinsPanels.js
│		│		│		├── PersosPanels.js
│		│		├── Event.js
│		│		├── Brin.js
│		│		├── Perso.js
│		│
│   ├── index.html
│   ├── app.js
│   └── style.css
└── exports/
```

---

# Backend

## app.rb

```ruby
require 'sinatra'
require 'json'

set :public_folder, 'public'

DATA_FILE = 'data/evenements.json'

helpers do
  def load_data
    return default_data unless File.exist?(DATA_FILE)

    JSON.parse(File.read(DATA_FILE))
  end

  def save_data(data)
    File.write(
      DATA_FILE,
      JSON.pretty_generate(data)
    )
  end

  def default_data
    {
      personnages: [],
      brins: [],
      evenements: []
    }
  end
end

get '/' do
  send_file File.join(
    settings.public_folder,
    'index.html'
  )
end

get '/events' do
  content_type :json

  load_data.to_json
end

post '/events' do
  request.body.rewind

  raw =
    request.body.read

  data =
    JSON.parse(raw)

  save_data(data)

  content_type :json

  {
    status: 'ok'
  }.to_json
end
```

---

# Frontend

Ruby + Sinatra.

Responsabilités :

- servir l’interface
- charger/sauvegarder les évènements
- exporter
- ouvrir des fichiers externes

Aucune logique métier compliquée.

---

# Données

## Évènement

```json
{
  "id": "ev12",
  "text": "Claire ment à Paul.",
  "brins": ["b12", "b569"],
  "type": "dialogue",
  "nature": "conf",
  "duration": 20,
  "file": "/Users/.../chapitre-03.md"
}
```

---

# Interface

## Structure

- colonne centrale unique
- une ligne = un évènement 
  - à gauche : son intitulé 
  - à droite : les trois lettres de ses brins

- édition directe
- déplacement immédiat
- filtres escamotables

---

### Panneaux (panel.js)

Le panneau des évènements est toujours affiché. Les panneaux des brins et des personnages s’affichent au besoin.

Les panneaux des évènements (Event, EventsPanel.js), des brins (Brin, BrinsPanel.js) et des personnages (Perso, PersosPanel.js) fonctionnent tous de la même façon (Panel.js)

* la touche « n » permet de **créer un nouvel élément** du type du panneau actif (Event, Brin ou Perso), sous l’élément sélectionné,
* les touches flèche haut/bas permettent de **passer en revue les éléments**,
* les touches ⌘ + flèche haut/bas, permettent de **déplacer les éléments**,
* la touche Delete (PAS backspace) permet de **détruire l’élément** sélectionné (sans demande, sans avertissement),
  * comportement particulier pour les brins : le retirer des évènements.
  * comportement particulier pour les personnages : le retirer des brins + des évènements.
* la touche Space (Espace) permet de sélectionner l’élément courant (une coche verte se place à côté, il n’y a RIEN lorsque l’élément n’est pas sélectionné)
* la touche « Entrée » permet d’**éditer l’élément** courant (évidemment, les autres raccourcis clavier ne doivent plus fonctionner),
  * quand on est en édition, la touche « Entrée » permet de sortir de l’édition + enregistrer les changements s’il y en a.

---

# Ligne évènement

Contient :

- texte (`Event.text`)
- badges de brins (`Brin.badge`)
- avatar ou lettres de personnages (`Perso.avatar` ou `Perso.badge`)
- durée si définie (`Event.duration`)

---

# Interactions

## Clavier

| Action | Raccourci |
|---|---|
| Nouvel Event/Brin/Perso (suivant panneau) | n |
| Mettre l’élément (suivant panneau) en courant | ↑↓ |
| Déplacer l’élément (suivant panneau) | Cmd/Ctrl + ↑↓ |
| Filtrer (par le panneau des brins) | / |
| Gérer les brins (afficher panneau) | # |
| Gérer les personnages (afficher panneau) | @ |
|  |  |
| Retour liste | Escape |

---

## Filtres

Le filtre principal est le **filtrage de la liste des évènements par brin**. Donc, quand on joue la touche « / », ça ouvre le panneau des brins (ça les décoche tous, donc ça fait disparaitre tous les évènements dessous) et on se déplace + Space pour choisir les brins. Au fur et à mesure, les évènements réapparaissent.

Ensuite, on a deux choix :

* touche ESCAPE :
  * ferme le panneau des brins
  * remet la liste intégrale des évènements
* touche ENTER :
  * ferme le panneau des brins
  * laisse la liste des brins filtrée
  * fait apparaitre le bouton « Ré-afficher tous les brins »

Pour le moment, pas de filtrage autre que par les brins. Pour filtrer par personnage, on crée un brin pour ledit personnage et l’on filtre avec ce brin.



## Types

### `Event`

| Propriété  | Description                                                  | Valeur |
| ---------- | ------------------------------------------------------------ | ------ |
| `id`       | Identifiant unique et universel                              |        |
| `text`     | Intitulé de l’évènement (affiché dans le panneau)            |        |
| `brins`    | Liste des identifiants des brins                             |        |
| `type`     | Type de l’évènement (dialogue, action, action et dialogue, autre) |        |
| `natures`  | La natures de l’évènement (conflictuel, descriptif, contemplatif, réflexif, démonstratif, etc.) |        |
| `duration` | Durée en secondes de l’évènement.                            |        |
| `file`     | Chemin au fichier associé à l’évènement (s’il existe). Pour le moment, ne peut être défini que manuellement dans le fichier JSON. |        |



### `Brin`

| Propriété | description                                                  |      |
| --------- | ------------------------------------------------------------ | ---- |
| `id`      | Identifiant unique et universel                              |      |
| `nom`     | La description du brin en une ligne courte. Dans la liste des évènements, elle apparait lorsque l’on survole le badge du brin. C’est le nom qui apparait dans le panneau des brins. |      |
| `badge`   | Trois lettres majuscules UNIQUES propre                      |      |
| `type`    | Le type de brin (valeurs : intrigue principale, intrigue amoureuse, intrigue, personnage, relation, thème, accessoire, autre). |      |
| `persos`  | Liste des personnages du brin (identifiants).                |      |
| `file`    | Chemin du fichier associé au brin.                           |      |

### `Perso`

| Propriété   | DESCRIPTION                             | VALEURS             |
| ----------- | --------------------------------------- | ------------------- |
| `id`        | Identifiant unique universel            |                     |
| `badge`     | Deux lettre capitales uniques           | **SK**              |
| `avatar`    | Avatar (émoji, par exemple)             | 🤡                   |
| `pseudo`    | Nom usuel dans l’histoire               | **Stan**            |
| `patronyme` | Prénom Nom                              | ****                |
| `fonctions` | Fonctions dans le récit                 | Mentor, Antagoniste |
| `file`      | Chemin au fichier associé au personnage |                     |
|             |                                         |                     |



---

# Style visuel

## Principes

- très peu de chrome
- peu de couleurs
- typographie dominante
- densité faible
- animations discrètes
- fond neutre
- pas d’effets “application moderne”

---

# Technique front

- HTML
- CSS
- JavaScript vanilla

Le DOM suffit largement.

---

# Sauvegarde

- sauvegarde automatique discrète
- un seul fichier JSON
- export possible

---

# Priorités réelles

1. fluidité d’édition
2. déplacement immédiat
3. filtrage agréable
4. lisibilité
5. stabilité

Pas :

- sophistication technique
- architecture
- “scalabilité”
- plugins
- cloud
- collaboration

---

## Développements ultérieurs

* pouvoir ouvrir le fichier associé à l’évènement, au brin, au personnage
* pouvoir définir en le choisissant le fichier associé à l’évènement, au brin, au personnage
* export dans différents formats

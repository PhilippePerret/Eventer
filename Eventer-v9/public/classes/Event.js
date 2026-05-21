class Event {

  constructor(data = {}, db) {
    this.db = db
    this.id = data.id || crypto.randomUUID()
    this.text = data.text || ''
    this.brins = data.brins || []
    this.personnages = data.personnages || []
    this.type = data.type || ''
    this.duration = data.duration || null
    this.file = data.file || ''
  }

  extractTags(shouldRender = true) {
    const text = this.text || ''

    const brinMatches = [...text.matchAll(/#([\p{L}\d_-]+)/gu)]
    const persoMatches = [...text.matchAll(/@([\p{L}\d_-]+)/gu)]

    this.brins = []
    this.personnages = []

    brinMatches.forEach(match => {
      const name = match[1]

      let brin = this.db.brins.find(b =>
        b.nom === name || b.badge === name
      )

      if (!brin) {
        brin = new Brin({
          id: crypto.randomUUID(),
          nom: name,
          badge: name.slice(0, 3).toUpperCase(),
          type: '',
          persos: [],
          file: ''
        })

        this.db.brins.push(brin)
      }

      if (!this.brins.includes(brin.id)) {
        this.brins.push(brin.id)
      }
    })

    persoMatches.forEach(match => {
      const name = match[1]

      let perso = this.db.personnages.find(p =>
        p.pseudo === name || p.badge === name
      )

      if (!perso) {
        perso = new Perso({
          id: crypto.randomUUID(),
          pseudo: name,
          badge: name.slice(0, 2).toUpperCase(),
          avatar: '',
          patronyme: '',
          fonctions: [],
          file: ''
        })

        this.db.personnages.push(perso)
      }

      if (!this.personnages.includes(perso.id)) {
        this.personnages.push(perso.id)
      }
    })

    if (shouldRender && typeof eventsPanel !== 'undefined') {
      eventsPanel.render()
    }
  }

}

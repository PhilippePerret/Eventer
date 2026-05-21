class Database {

  constructor(data = {}) {
    this.personnages = (data.personnages || []).map(p => new Perso(p))
    this.brins = (data.brins || []).map(b => new Brin(b))
    this.evenements = (data.evenements || []).map(e => new Event(e, this))
  }

  findBrin(id) {
    return this.brins.find(b => b.id === id)
  }

  findPerso(id) {
    return this.personnages.find(p => p.id === id)
  }

  toJSON() {
    return {
      personnages: this.personnages.map(p => ({
        id: p.id,
        badge: p.badge || '',
        avatar: p.avatar || '',
        pseudo: p.pseudo || '',
        patronyme: p.patronyme || '',
        fonctions: p.fonctions || [],
        file: p.file || ''
      })),

      brins: this.brins.map(b => ({
        id: b.id,
        nom: b.nom || '',
        badge: b.badge || '',
        type: b.type || '',
        persos: b.persos || [],
        file: b.file || ''
      })),

      evenements: this.evenements.map(e => ({
        id: e.id,
        text: e.text || '',
        brins: e.brins || [],
        personnages: e.personnages || [],
        type: e.type || '',
        duration: e.duration || null,
        file: e.file || ''
      }))
    }
  }

}

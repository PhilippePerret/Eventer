class Perso {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID()
    this.badge = data.badge || ''
    this.avatar = data.avatar || ''
    this.pseudo = data.pseudo || data.nom || ''
    this.patronyme = data.patronyme || ''
    this.fonctions = Array.isArray(data.fonctions)
      ? data.fonctions
      : (data.fonction ? [data.fonction] : [])
    this.file = data.file || data.fichier || ''
  }

  get label() {
    return this.avatar || this.badge || this.pseudo
  }
}

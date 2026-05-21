class Brin {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID()
    this.nom = data.nom || ''
    this.badge = data.badge || ''
    this.type = data.type || ''
    this.color = ColorTools.normalize(data.color) || ''
    this.persos = data.persos || data.personnages || []
    this.file = data.file || data.fichier || ''
  }

  get label() {
    return this.badge || this.nom
  }
}

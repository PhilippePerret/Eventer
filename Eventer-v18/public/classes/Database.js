class Database {

  constructor(data = {}) {
    this.options = {
      ...APP_CONFIG.defaultOptions,
      ...(data.options || {})
    }

    this.personnages = (data.personnages || []).map(p => new Perso(p))
    this.brins = (data.brins || []).map(b => new Brin(b))
    this.ensureBrinColors()
    this.evenements = (data.evenements || []).map(e => new Event(e, this))
  }

  ensureBrinColors() {
    this.brins.forEach(brin => {
      if (!brin.color) brin.color = this.nextUnusedBrinColor()
    })
  }

  usedBrinColors() {
    return new Set(
      this.brins
        .map(brin => ColorTools.normalize(brin.color))
        .filter(Boolean)
    )
  }

  nextUnusedBrinColor() {
    const used = this.usedBrinColors()
    const color = APP_CONFIG.brinColors.find(value => !used.has(value))

    if (color) return color

    const hue = (this.brins.length * 47) % 360
    return this.hslToHex(hue, 48, 74)
  }

  hslToHex(h, s, l) {
    s /= 100
    l /= 100

    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0')

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
  }

  findBrin(id) {
    return this.brins.find(b => b.id === id)
  }

  findPerso(id) {
    return this.personnages.find(p => p.id === id)
  }

  toJSON() {
    return {
      options: {
        ...APP_CONFIG.defaultOptions,
        ...(this.options || {})
      },

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
        color: b.color || '',
        persos: b.persos || [],
        file: b.file || ''
      })),

      evenements: this.evenements.map(e => ({
        id: e.id,
        text: e.text || '',
        brins: e.brins || [],
        persos: e.persos || [],
        checked: !!e.checked,
        state: e.state || '---',
        type: e.type || '',
        duration: e.duration || null,
        file: e.file || ''
      }))
    }
  }

}

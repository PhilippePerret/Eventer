const APP_CONFIG = {
  brinTypes: [
    'intrigue principale',
    'intrigue amoureuse',
    'intrigue',
    'personnage',
    'relation',
    'thème',
    'accessoire',
    'autre'
  ],

  persoFonctions: [
    'Protagoniste',
    'Co-protagoniste',
    'Antagoniste',
    'Adjuvant',
    'Allié',
    'Bras droit antagoniste',
    'Mentor'
  ],

  defaultOptions: {
    colorizeEventsWithFirstBrin: true
  },

  eventStates: [
    '---',
    'Non écrit',
    'Ébauché',
    'Approfondir',
    'À relire',
    'Achevé'
  ],

  brinColors: [
    '#d9c8a9',
    '#c8d9a9',
    '#a9d9c8',
    '#a9c8d9',
    '#c8a9d9',
    '#d9a9c8',
    '#d9b0a9',
    '#d9d1a9',
    '#b0d9a9',
    '#a9d1d9',
    '#b0a9d9',
    '#d9a9b0'
  ]
}

const ColorTools = {
  normalize(hex) {
    if (!hex) return ''

    const value = String(hex).trim()

    if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase()

    if (/^#[0-9a-f]{3}$/i.test(value)) {
      return '#' + value.slice(1).split('').map(c => c + c).join('').toLowerCase()
    }

    return ''
  },

  textColor(hex) {
    const color = this.normalize(hex)
    if (!color) return ''

    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.57 ? '#2f2d29' : '#fffaf3'
  },

  applyBadgeColor(element, color) {
    const normalized = this.normalize(color)
    if (!element || !normalized) return

    element.style.backgroundColor = normalized
    element.style.color = this.textColor(normalized)
  }
}

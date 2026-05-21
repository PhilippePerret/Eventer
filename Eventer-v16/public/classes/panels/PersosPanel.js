class PersosPanel extends Panel {

  constructor(owner, db, options = {}) {
    super({
      items: db.personnages,
      container: document.querySelector('#panel'),
      overlay: document.querySelector('#panel-overlay'),
      modal: true,
      title: options.title || 'Personnages',
      parentPanel: options.parentPanel || null
    })

    this.owner = owner
    this.db = db
    this.ownerType = options.ownerType || 'event'
  }

  editableProperties() {
    return ['badge', 'avatar', 'pseudo', 'patronyme', 'fonctions', 'file']
  }

  createItem() {
    this.stopEditing(true)

    const perso = new Perso({
      id: crypto.randomUUID(),
      badge: '',
      avatar: '',
      pseudo: '',
      patronyme: '',
      fonctions: [],
      file: ''
    })

    this.items.splice(this.selectedIndex + 1, 0, perso)
    this.selectedIndex++
    this.render()
    this.startEditing('badge')
    scheduleSave()
  }

  afterDeleteItem(perso) {
    this.db.evenements.forEach(event => {
      event.personnages = (event.personnages || []).filter(id => id !== perso.id)
    })

    this.db.brins.forEach(brin => {
      brin.persos = (brin.persos || []).filter(id => id !== perso.id)
    })
  }

  checked(perso) {
    if (!this.owner) return false

    if (this.ownerType === 'brin') {
      this.owner.persos ||= []
      return this.owner.persos.includes(perso.id)
    }

    this.owner.personnages ||= []
    return this.owner.personnages.includes(perso.id)
  }

  toggleCurrentItem() {
    const perso = this.currentItem()
    if (!perso || !this.owner) return

    const listName = 'persos'
    this.owner[listName] ||= []

    const index = this.owner[listName].indexOf(perso.id)

    if (index > -1) {
      this.owner[listName].splice(index, 1)
    } else {
      this.owner[listName].push(perso.id)
    }

    eventsPanel.render()
    if (this.parentPanel) this.parentPanel.render()
    this.render()
    scheduleSave()
  }

  commitEditing(element) {
    const perso = this.editingItem || this.currentItem()
    if (!perso) return

    const property = element.dataset.property

    if (property === 'fonctions') {
      perso.fonctions = element.value ? [element.value] : []
      return
    }

    if (property) {
      perso[property] = element.textContent.trim()
    }
  }

  renderItem(perso, index) {
    const row = document.createElement('div')
    row.className = 'panel-row perso-row'

    this.selectRow(row, index)

    const check = document.createElement('div')
    check.className = 'panel-check'
    check.textContent = this.checked(perso) ? '✓' : ''

    const badge = document.createElement('div')
    badge.className = 'panel-badge'
    badge.dataset.editable = 'true'
    badge.dataset.property = 'badge'
    badge.textContent = perso.badge || ''

    const avatar = document.createElement('div')
    avatar.className = 'panel-avatar'
    avatar.dataset.editable = 'true'
    avatar.dataset.property = 'avatar'
    avatar.textContent = perso.avatar || ''

    const name = document.createElement('div')
    name.className = 'panel-name'
    name.dataset.editable = 'true'
    name.dataset.property = 'pseudo'
    name.textContent = perso.pseudo || ''

    const patronyme = document.createElement('div')
    patronyme.className = 'panel-patronyme'
    patronyme.dataset.editable = 'true'
    patronyme.dataset.property = 'patronyme'
    patronyme.textContent = perso.patronyme || ''

    const fonctions = document.createElement('select')
    fonctions.className = 'panel-type field-select'
    fonctions.dataset.property = 'fonctions'

    const empty = document.createElement('option')
    empty.value = ''
    empty.textContent = ''
    fonctions.appendChild(empty)

    APP_CONFIG.persoFonctions.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      fonctions.appendChild(option)
    })

    fonctions.value = (perso.fonctions || [])[0] || ''
    fonctions.addEventListener('change', () => {
      perso.fonctions = fonctions.value ? [fonctions.value] : []
      scheduleSave()
    })

    const file = document.createElement('div')
    file.className = 'panel-file'
    file.dataset.editable = 'true'
    file.dataset.property = 'file'
    file.textContent = perso.file || ''

    row.append(check, badge, avatar, name, patronyme, fonctions, file)
    return row
  }

}

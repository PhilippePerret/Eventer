class BrinsPanel extends Panel {

  constructor(event, db, options = {}) {
    super({
      items: db.brins,
      container: document.querySelector('#panel'),
      overlay: document.querySelector('#panel-overlay'),
      modal: true,
      title: options.title || 'Brins'
    })

    if (!options.title && event) {
      this.title = () => `Brins · ${this.shortLabel(event.text)}`
    }

    this.event = event
    this.db = db
    this.filterMode = options.filterMode || false
    this.selectedBrins = new Set()
  }

  editableProperties() {
    return ['nom', 'badge', 'type', 'file']
  }

  createItem() {
    this.stopEditing(true)

    const brin = new Brin({
      id: crypto.randomUUID(),
      nom: '',
      badge: '',
      type: 'autre',
      color: this.db.nextUnusedBrinColor(),
      persos: [],
      file: ''
    })

    this.items.splice(this.selectedIndex + 1, 0, brin)
    this.selectedIndex++
    this.render()
    this.startEditing('nom')
    scheduleSave()
  }

  afterDeleteItem(brin) {
    this.db.evenements.forEach(event => {
      event.brins = (event.brins || []).filter(id => id !== brin.id)
    })
  }

  checked(brin) {
    if (this.filterMode) {
      return this.selectedBrins.has(brin.id)
    }

    if (!this.event) return false

    this.event.brins ||= []
    return this.event.brins.includes(brin.id)
  }

  toggleCurrentItem() {
    const brin = this.currentItem()
    if (!brin) return

    if (this.filterMode) {
      if (this.selectedBrins.has(brin.id)) {
        this.selectedBrins.delete(brin.id)
      } else {
        this.selectedBrins.add(brin.id)
      }

      this.applyFilter()
      this.render()
      return
    }

    this.event.brins ||= []

    const index = this.event.brins.indexOf(brin.id)

    if (index > -1) {
      this.event.brins.splice(index, 1)
    } else {
      this.event.brins.push(brin.id)
    }

    eventsPanel.render()
    this.render()
    scheduleSave()
  }

  applyFilter() {
    const ids = [...this.selectedBrins]

    if (!ids.length) {
      eventsPanel.items = []
    } else {
      eventsPanel.items = this.db.evenements.filter(event =>
        (event.brins || []).some(id => ids.includes(id))
      )
    }

    eventsPanel.setSelectedIndex(0)
    eventsPanel.render()
  }

  close() {
    if (this.filterMode && !this.selectedBrins.size) {
      eventsPanel.items = this.db.evenements
      eventsPanel.render()
    }

    super.close()
  }

  commitEditing(element) {
    const brin = this.editingItem || this.currentItem()
    if (!brin) return

    const property = element.dataset.property

    if (property === 'type') {
      brin.type = element.value
      return
    }

    if (property) {
      brin[property] = element.textContent.trim()
    }

    if (!brin.badge && brin.nom) {
      brin.badge = brin.nom.slice(0, 3).toUpperCase()
    }
  }

  renderItem(brin, index) {
    const row = document.createElement('div')
    row.className = 'panel-row brin-row'

    this.selectRow(row, index)

    const check = document.createElement('div')
    check.className = 'panel-check'
    check.textContent = this.checked(brin) ? '✓' : ''

    const color = document.createElement('input')
    color.type = 'color'
    color.className = 'panel-color'
    color.value = ColorTools.normalize(brin.color) || '#d9c8a9'
    color.title = 'Couleur du brin'
    color.addEventListener('input', () => {
      brin.color = color.value
      ColorTools.applyBadgeColor(badge, brin.color)
      eventsPanel.render()
      scheduleSave()
    })
    color.addEventListener('click', e => e.stopPropagation())

    const badge = document.createElement('div')
    badge.className = 'panel-badge'
    badge.dataset.editable = 'true'
    badge.dataset.property = 'badge'
    badge.textContent = brin.badge || ''
    ColorTools.applyBadgeColor(badge, brin.color)

    const name = document.createElement('div')
    name.className = 'panel-name'
    name.dataset.editable = 'true'
    name.dataset.property = 'nom'
    name.textContent = brin.nom || ''

    const type = document.createElement('select')
    type.className = 'panel-type field-select'
    type.dataset.property = 'type'
    APP_CONFIG.brinTypes.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      type.appendChild(option)
    })
    type.value = brin.type || 'autre'
    type.addEventListener('change', () => {
      brin.type = type.value
      scheduleSave()
    })

    const persos = document.createElement('div')
    persos.className = 'panel-persos'

    ;(brin.persos || []).forEach(id => {
      const perso = this.db.findPerso(id)
      if (!perso) return

      const badgePerso = document.createElement('span')
      badgePerso.className = 'badge perso'
      badgePerso.textContent = perso.avatar || perso.badge || perso.pseudo || ''
      badgePerso.title = perso.pseudo || ''
      persos.appendChild(badgePerso)
    })

    const file = document.createElement('div')
    file.className = 'panel-file'
    file.dataset.editable = 'true'
    file.dataset.property = 'file'
    file.textContent = brin.file || ''

    row.append(check, color, badge, name, type, persos, file)
    return row
  }

  handleKeydown(e) {
    if (this.filterMode && e.key === 'Enter' && !this.editing) {
      e.preventDefault()
      super.close()
      return true
    }

    if (e.key === 'Escape' && this.filterMode && !this.editing) {
      e.preventDefault()
      this.selectedBrins.clear()
      eventsPanel.items = this.db.evenements
      eventsPanel.render()
      super.close()
      return true
    }

    if (e.key === 'p') {
      const active = document.activeElement
      const isTextInput = active && (active.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName))

      if (this.editing && isTextInput) return super.handleKeydown(e)

      e.preventDefault()
      this.stopEditing(true)
      const brin = this.currentItem()
      if (brin) {
        new PersosPanel(brin, this.db, {
          ownerType: 'brin',
          title: () => `Personnages · ${this.shortLabel(brin.nom || brin.badge || 'brin')}`,
          parentPanel: this
        }).open()
      }
      return true
    }

    return super.handleKeydown(e)
  }

}

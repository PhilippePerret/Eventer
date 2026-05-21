class EventsPanel extends Panel {

  constructor(db) {
    super({
      items: db.evenements,
      container: document.querySelector('#events'),
      modal: false
    })

    this.db = db
  }

  editableProperties() {
    return ['text', 'state']
  }

  createItem() {
    this.stopEditing(true)

    const event = new Event({
      id: crypto.randomUUID(),
      text: '',
      brins: [],
      persos: [],
      checked: false,
      state: '---',
      type: '',
      duration: null,
      file: ''
    }, this.db)

    this.items.splice(this.selectedIndex + 1, 0, event)
    this.selectedIndex++
    this.render()
    this.startEditing('text')
    scheduleSave()
  }

  commitEditing(element) {
    const event = this.editingItem || this.currentItem()
    if (!event) return

    if (element.dataset.property === 'text') {
      event.text = element.textContent.trim()
      event.extractTags(false)
    }

    if (element.dataset.property === 'state') {
      event.state = element.value
    }
  }

  renderPersoBadge(perso, className = '') {
    const badge = document.createElement('span')
    badge.className = `badge perso ${className}`.trim()
    badge.textContent = perso.avatar || perso.badge || perso.pseudo || ''
    badge.title = perso.pseudo || ''
    return badge
  }

  renderItem(event, index) {
    const row = document.createElement('article')
    row.className = 'event'
    row.draggable = true

    this.selectRow(row, index)

    const checkGutter = document.createElement('div')
    checkGutter.className = 'event-check-gutter'

    if (event.checked) {
      const done = document.createElement('span')
      done.className = 'event-check'
      done.textContent = '✓'
      checkGutter.appendChild(done)
    }

    const body = document.createElement('div')
    body.className = 'event-body'

    const firstBrin = this.db.findBrin((event.brins || [])[0])
    if (this.db.options.colorizeEventsWithFirstBrin && firstBrin && firstBrin.color) {
      body.style.backgroundColor = firstBrin.color
      body.style.color = ColorTools.textColor(firstBrin.color)
    }

    const text = document.createElement('div')
    text.className = 'event-text'
    text.dataset.editable = 'true'
    text.dataset.property = 'text'
    text.contentEditable = false
    text.spellcheck = false
    text.textContent = event.text || ''

    const meta = document.createElement('div')
    meta.className = 'event-meta'

    const state = document.createElement('select')
    state.className = 'event-state'
    state.dataset.property = 'state'
    state.title = 'État'
    APP_CONFIG.eventStates.forEach(value => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      if ((event.state || '---') === value) option.selected = true
      state.appendChild(option)
    })
    state.addEventListener('change', () => {
      event.state = state.value
      scheduleSave()
    })
    meta.appendChild(state)

    ;(event.brins || []).forEach(id => {
      const brin = this.db.findBrin(id)
      if (!brin) return

      const badge = document.createElement('span')
      badge.className = 'badge brin'
      badge.textContent = brin.badge || ''
      badge.title = brin.nom || ''
      ColorTools.applyBadgeColor(badge, brin.color)
      if (badge.textContent.trim()) meta.appendChild(badge)
    })

    const brinPersoIds = []
    ;(event.brins || []).forEach(id => {
      const brin = this.db.findBrin(id)
      if (!brin) return
      ;(brin.persos || []).forEach(persoId => {
        if (!brinPersoIds.includes(persoId)) brinPersoIds.push(persoId)
      })
    })

    const ownPersoIds = []
    ;(event.persos || []).forEach(id => {
      if (!ownPersoIds.includes(id)) ownPersoIds.push(id)
    })

    brinPersoIds.forEach(id => {
      const perso = this.db.findPerso(id)
      if (!perso) return
      meta.appendChild(this.renderPersoBadge(perso, 'from-brin'))
    })

    if (brinPersoIds.length && ownPersoIds.length) {
      const separator = document.createElement('span')
      separator.className = 'perso-separator'
      separator.textContent = '│'
      meta.appendChild(separator)
    }

    ownPersoIds.forEach(id => {
      const perso = this.db.findPerso(id)
      if (!perso) return
      meta.appendChild(this.renderPersoBadge(perso, 'from-event'))
    })

    const left = document.createElement('div')
    left.className = 'event-left'
    left.append(text)

    body.append(left, meta)
    row.append(checkGutter, body)

    row.addEventListener('dragstart', e => {
      this.stopEditing(true)
      e.dataTransfer.setData('text/plain', index)
    })

    row.addEventListener('dragover', e => {
      e.preventDefault()
    })

    row.addEventListener('drop', e => {
      e.preventDefault()
      this.moveItem(Number(e.dataTransfer.getData('text/plain')), index)
    })

    return row
  }


  toggleCurrentItem() {
    const event = this.currentItem()
    if (!event) return
    event.checked = !event.checked
    this.render()
    scheduleSave()
  }

  handleKeydown(e) {
    if (super.handleKeydown(e)) return true

    const event = this.currentItem()

    if (e.key === 'b') {
      e.preventDefault()
      this.stopEditing(true)
      new BrinsPanel(event, this.db).open()
      return true
    }

    if (e.key === 'p') {
      e.preventDefault()
      this.stopEditing(true)
      new PersosPanel(event, this.db, { ownerType: 'event', title: () => `Personnages · ${this.shortLabel(event.text)}` }).open()
      return true
    }

    if (e.key === 'o') {
      e.preventDefault()
      this.stopEditing(true)
      new OptionsPanel(this.db).open()
      return true
    }

    if (e.key === '/') {
      e.preventDefault()
      this.stopEditing(true)
      new BrinsPanel(null, this.db, { filterMode: true, title: 'Filtrer par brins' }).open()
      return true
    }

    return false
  }

}

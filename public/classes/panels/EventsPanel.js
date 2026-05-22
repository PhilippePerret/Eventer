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
      file: '',
      child: ''
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
    meta.prepend(state)

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

    if (event.child && event.childHasEvents) {
      const child = document.createElement('button')
      child.type = 'button'
      child.className = 'event-child-indicator'
      child.textContent = '↘'
      child.title = 'Ouvrir l’évènemencier enfant'
      child.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        this.stopEditing(true)
        openChildEventer(event)
      })
      text.appendChild(child)
    }

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
    if (window.UI && UI.renderFooter) UI.renderFooter()
    scheduleSave()
  }


  checkedEvents() {
    return this.items.filter(event => event.checked)
  }

  clipboardSourceEvents() {
    const checked = this.checkedEvents()
    if (checked.length) return checked

    const current = this.currentItem()
    return current ? [current] : []
  }

  brinToClipboardData(brin) {
    return JSON.parse(JSON.stringify({
      id: brin.id,
      nom: brin.nom || '',
      badge: brin.badge || '',
      type: brin.type || '',
      color: brin.color || '',
      persos: brin.persos || [],
      file: brin.file || ''
    }))
  }

  persoToClipboardData(perso) {
    return JSON.parse(JSON.stringify({
      id: perso.id,
      badge: perso.badge || '',
      avatar: perso.avatar || '',
      pseudo: perso.pseudo || '',
      patronyme: perso.patronyme || '',
      fonctions: perso.fonctions || [],
      file: perso.file || ''
    }))
  }

  eventToClipboardData(event) {
    const brinIds = event.brins || []
    const persoIds = new Set(event.persos || [])
    const brins = []

    brinIds.forEach(id => {
      const brin = this.db.findBrin(id)
      if (!brin) return
      brins.push(this.brinToClipboardData(brin))
      ;(brin.persos || []).forEach(persoId => persoIds.add(persoId))
    })

    const persos = Array.from(persoIds)
      .map(id => this.db.findPerso(id))
      .filter(Boolean)
      .map(perso => this.persoToClipboardData(perso))

    return JSON.parse(JSON.stringify({
      event: {
        id: event.id,
        text: event.text || '',
        brins: event.brins || [],
        persos: event.persos || [],
        checked: false,
        state: event.state || '---',
        type: event.type || '',
        duration: event.duration || null,
        file: event.file || '',
        child: event.child || ''
      },
      brins,
      persos
    }))
  }

  ensureClipboardDataInCurrentDatabase(data) {
    ;(data.persos || []).forEach(persoData => {
      if (!this.db.findPerso(persoData.id)) {
        this.db.personnages.push(new Perso(JSON.parse(JSON.stringify(persoData))))
      }
    })

    ;(data.brins || []).forEach(brinData => {
      if (!this.db.findBrin(brinData.id)) {
        this.db.brins.push(new Brin(JSON.parse(JSON.stringify(brinData))))
      }
    })
  }

  cloneClipboardEvent(data) {
    this.ensureClipboardDataInCurrentDatabase(data)

    return new Event({
      ...JSON.parse(JSON.stringify(data.event || data)),
      id: crypto.randomUUID(),
      checked: false
    }, this.db)
  }

  copyEvents() {
    const source = this.clipboardSourceEvents()
    if (!source.length) return false

    eventClipboard = {
      type: 'events',
      items: source.map(event => this.eventToClipboardData(event))
    }

    return true
  }

  cutEvents() {
    const source = this.clipboardSourceEvents()
    if (!source.length) return false

    this.copyEvents()

    const ids = new Set(source.map(event => event.id))
    this.items = this.items.filter(event => !ids.has(event.id))
    this.db.evenements = this.items
    this.setSelectedIndex(Math.min(this.selectedIndex, this.items.length - 1))
    this.render()
    scheduleSave()
    return true
  }

  pasteEventsBeforeCurrent() {
    if (!eventClipboard || eventClipboard.type !== 'events' || !eventClipboard.items.length) return false

    const pasted = eventClipboard.items.map(data => this.cloneClipboardEvent(data))
    const index = this.items.length ? Math.max(0, this.selectedIndex) : 0

    this.items.splice(index, 0, ...pasted)
    this.db.evenements = this.items
    this.selectedIndex = index
    this.render()
    scheduleSave()
    return true
  }

  handleKeydown(e) {
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
      const key = e.key.toLowerCase()

      if (key === 'c') {
        e.preventDefault()
        return this.copyEvents()
      }

      if (key === 'x') {
        e.preventDefault()
        return this.cutEvents()
      }

      if (key === 'v') {
        e.preventDefault()
        return this.pasteEventsBeforeCurrent()
      }
    }

    if (super.handleKeydown(e)) return true

    const event = this.currentItem()

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      this.stopEditing(true)
      openChildEventer(event)
      return true
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      this.stopEditing(true)
      openParentEventer()
      return true
    }

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

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
    return ['text']
  }

  createItem() {
    this.stopEditing(true)

    const event = new Event({
      id: crypto.randomUUID(),
      text: '',
      brins: [],
      personnages: [],
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
  }

  renderItem(event, index) {
    const row = document.createElement('article')
    row.className = 'event'
    row.draggable = true

    this.selectRow(row, index)

    const text = document.createElement('div')
    text.className = 'event-text'
    text.dataset.editable = 'true'
    text.dataset.property = 'text'
    text.contentEditable = false
    text.spellcheck = false
    text.textContent = event.text || ''

    const meta = document.createElement('div')
    meta.className = 'event-meta'

    ;(event.brins || []).forEach(id => {
      const brin = this.db.findBrin(id)
      if (!brin) return

      const badge = document.createElement('span')
      badge.className = 'badge brin'
      badge.textContent = brin.badge || brin.nom || ''
      badge.title = brin.nom || ''
      meta.appendChild(badge)
    })

    ;(event.personnages || []).forEach(id => {
      const perso = this.db.findPerso(id)
      if (!perso) return

      const badge = document.createElement('span')
      badge.className = 'badge perso'
      badge.textContent = perso.avatar || perso.badge || perso.pseudo || ''
      badge.title = perso.pseudo || ''
      meta.appendChild(badge)
    })

    const left = document.createElement('div')
    left.className = 'event-left'
    left.append(text)

    row.append(left, meta)

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

  handleKeydown(e) {
    if (super.handleKeydown(e)) return true

    const event = this.currentItem()

    if (e.key === '#' || e.key === 'b') {
      e.preventDefault()
      this.stopEditing(true)
      new BrinsPanel(event, this.db, { title: 'Brins de l’évènement' }).open()
      return true
    }

    if (e.key === '@') {
      e.preventDefault()
      this.stopEditing(true)
      new PersosPanel(event, this.db, { ownerType: 'event', title: 'Personnages de l’évènement' }).open()
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

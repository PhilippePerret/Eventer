class Panel {

  constructor(options = {}) {
    this.items = options.items || []
    this.container = options.container || document.querySelector('#panel')
    this.overlay = options.overlay || document.querySelector('#panel-overlay')
    this.modal = options.modal !== false
    this.selectedIndex = options.selectedIndex || 0
    this.editing = false
    this.editingElement = null
    this.editingItem = null
    this.editingItem = null
    this.editingPropertyIndex = 0
    this.parentPanel = options.parentPanel || null
    this.title = options.title || ''
    this.modeName = options.modeName || 'events'
    this.editingModeName = options.editingModeName || null
  }

  uiMode() {
    return this.editing && this.editingModeName ? this.editingModeName : this.modeName
  }

  panelTitle() {
    return typeof this.title === 'function' ? this.title() : (this.title || '')
  }

  shortLabel(text, max = 42) {
    const value = String(text || '').trim()
    return value.length > max ? value.slice(0, max - 1).trim() + '…' : value
  }

  open() {
    this.setSelectedIndex(this.selectedIndex)

    if (this.modal && this.overlay) {
      this.overlay.classList.remove('hidden')
    }

    UI.panel = this
    this.render()
    updateShortcutsFooter()
  }

  close() {
    this.stopEditing(true)

    UI.panel = this.parentPanel || null

    if (this.parentPanel) {
      this.parentPanel.render()
      updateShortcutsFooter()
      return
    }

    if (this.modal && this.overlay) {
      this.overlay.classList.add('hidden')
    }
    updateShortcutsFooter()
  }

  currentItem() {
    return this.items[this.selectedIndex]
  }

  editableProperties() {
    return []
  }

  mainProperty() {
    return this.editableProperties()[0] || null
  }

  setSelectedIndex(index) {
    if (!this.items.length) {
      this.selectedIndex = 0
      return
    }

    this.selectedIndex = Math.max(0, Math.min(index, this.items.length - 1))
  }

  moveSelection(direction) {
    this.stopEditing(true)
    this.setSelectedIndex(this.selectedIndex + direction)
    this.render()
  }

  moveItem(from, to) {
    this.stopEditing(true)

    if (from === to) return
    if (from < 0 || to < 0) return
    if (from >= this.items.length || to >= this.items.length) return

    const item = this.items.splice(from, 1)[0]
    this.items.splice(to, 0, item)

    this.selectedIndex = to
    this.afterMoveItem(item, from, to)
    this.render()
    scheduleSave()
  }

  afterMoveItem(_item, _from, _to) {}

  deleteSelectedItem() {
    this.stopEditing(true)

    const item = this.currentItem()
    if (!item) return

    this.items.splice(this.selectedIndex, 1)
    this.afterDeleteItem(item)
    this.setSelectedIndex(this.selectedIndex)
    this.render()
    scheduleSave()
  }

  afterDeleteItem(_item) {}

  createItem() {}

  toggleCurrentItem() {}

  renderHeader() {
    if (!this.modal) return null

    const header = document.createElement('div')
    header.className = 'panel-header'

    const title = document.createElement('div')
    title.className = 'panel-title'
    title.textContent = this.panelTitle()

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'panel-close'
    button.textContent = 'Fermer · Cmd+Enter'
    button.addEventListener('click', () => this.close())

    header.append(title, button)
    return header
  }

  render() {
    if (!this.container) return

    this.container.innerHTML = ''

    const header = this.renderHeader()
    if (header) this.container.appendChild(header)

    this.items.forEach((item, index) => {
      this.container.appendChild(
        this.renderItem(item, index)
      )
    })
  }

  renderItem(_item, _index) {
    throw new Error('renderItem doit être défini par la sous-classe')
  }

  selectRow(row, index) {
    row.dataset.index = index

    if (index === this.selectedIndex) {
      row.classList.add('selected')
    }

    row.addEventListener('mousedown', e => {
      if (!this.editing) return
      if (this.editingElement && this.editingElement.contains(e.target)) return

      e.preventDefault()
      this.stopEditing(true)
      this.selectedIndex = index
      this.render()
    })

    row.addEventListener('click', e => {
      if (this.editing) return

      this.selectedIndex = index

      if (e.target.closest('select')) {
        return
      }

      this.render()
      e.stopPropagation()
    })
  }

  editableElement(property = null) {
    const row = this.container.querySelector(`[data-index="${this.selectedIndex}"]`)
    if (!row) return null

    const prop = property || this.mainProperty()
    if (!prop) return row.querySelector('[data-editable="true"]')

    return row.querySelector(`[data-property="${prop}"]`)
  }

  startEditing(property = null) {
    const properties = this.editableProperties()
    const prop = property || this.mainProperty()
    const propertyIndex = Math.max(0, properties.indexOf(prop))

    const element = this.editableElement(prop)
    if (!element) return

    this.editing = true
    this.editingElement = element
    this.editingItem = this.currentItem()
    this.editingPropertyIndex = propertyIndex

    if (element.tagName === 'SELECT') {
      element.classList.add('editing-select')
      element.focus()
      updateShortcutsFooter()
      return
    }

    element.contentEditable = true
    element.spellcheck = false
    element.focus()

    const range = document.createRange()
    const selection = window.getSelection()

    range.selectNodeContents(element)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    updateShortcutsFooter()
  }

  stopEditing(shouldSave = true) {
    if (!this.editing) return

    const element = this.editingElement

    if (element) {
      if (shouldSave) {
        this.commitEditing(element)
      }

      if (element.tagName !== 'SELECT') {
        element.contentEditable = false
      } else {
        element.classList.remove('editing-select')
      }

      element.blur()
    }

    this.editing = false
    this.editingElement = null
    this.editingItem = null

    if (shouldSave) {
      this.render()
      scheduleSave()
    }
    updateShortcutsFooter()
  }

  editNextProperty() {
    const properties = this.editableProperties()
    if (!properties.length) return

    this.stopEditing(true)

    this.editingPropertyIndex = (this.editingPropertyIndex + 1) % properties.length
    this.startEditing(properties[this.editingPropertyIndex])
  }

  commitEditing(_element) {}

  handleEditingKeydown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      this.editNextProperty()
      return true
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      this.stopEditing(true)
      return true
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      this.stopEditing(false)
      this.render()
      return true
    }

    return true
  }

  handleKeydown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      this.close()
      return true
    }

    if (this.editing) {
      return this.handleEditingKeydown(e)
    }

    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.moveItem(this.selectedIndex, this.selectedIndex - 1)
        return true
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.moveItem(this.selectedIndex, this.selectedIndex + 1)
        return true
      }
    }

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault()
        this.moveSelection(-1)
        return true

      case 'ArrowDown':
        e.preventDefault()
        this.moveSelection(1)
        return true

      case 'Delete':
        e.preventDefault()
        this.deleteSelectedItem()
        return true

      case 'Enter':
        e.preventDefault()
        this.startEditing()
        return true

      case ' ':
        e.preventDefault()
        this.toggleCurrentItem()
        return true

      case 'n':
        e.preventDefault()
        this.createItem()
        return true

      case 'Escape':
        if (this.modal) {
          e.preventDefault()
          this.close()
          return true
        }
        return false

      default:
        return false
    }
  }

}

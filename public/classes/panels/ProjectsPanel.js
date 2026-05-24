class ProjectsPanel extends Panel {

  constructor(options = {}) {
    super({
      items: (options.items || []).map(project => project instanceof Project ? project : new Project(project)),
      container: document.querySelector('#events'),
      modal: false,
      selectedIndex: options.selectedIndex || 0
    })

    this.previousSelectedIndex = this.selectedIndex
  }

  open() {
    UI.panel = null
    UI.mode = 'projects'
    UI.renderFooter()
    this.render()
  }

  editableProperties() {
    return ['title']
  }

  mainProperty() {
    return 'title'
  }

  currentProject() {
    return this.currentItem()
  }

  async reload({ selectedProjectId = null } = {}) {
    const previousId = selectedProjectId || this.currentProject()?.id

    const response = await fetch('/projects')
    if (!response.ok) return

    const projects = await response.json()

    this.items = projects.map(project => new Project(project))

    if (previousId) {
      const foundIndex = this.items.findIndex(project => project.id === previousId)
      this.selectedIndex = foundIndex >= 0 ? foundIndex : 0
    } else {
      this.selectedIndex = 0
    }

    this.render()
  }

  render() {
    this.container.innerHTML = ''

    const list = document.createElement('div')
    list.className = 'project-list'

    this.container.appendChild(list)

    this.items.forEach((project, index) => {
      list.appendChild(this.renderItem(project, index))
    })
  }

  renderItem(project, index) {
    const row = document.createElement('button')

    row.type = 'button'
    row.className = 'project-item'
    row.dataset.index = index

    if (index === this.selectedIndex) {
      row.classList.add('selected')
    }

    if (project.isDraft) {
      row.classList.add('draft')
      row.classList.add('editing')
    }

    const title = document.createElement('span')
    title.dataset.editable = 'true'
    title.dataset.property = 'title'
    title.textContent = project.title || ''

    row.appendChild(title)

    row.addEventListener('click', () => {
      this.selectedIndex = index
      this.render()
    })

    return row
  }

  async createItem() {
    this.previousSelectedIndex = this.selectedIndex

    const draft = new Project({
      id: '__draft__',
      title: '',
      file: ''
    })

    draft.isDraft = true

    this.items.push(draft)
    this.selectedIndex = this.items.length - 1

    this.render()

    this.startEditing('title')
  }

  startEditing(property = null) {
    super.startEditing(property)

    const row = this.container.querySelectorAll('.project-item')[this.selectedIndex]

    if (row) {
      row.classList.add('editing')
    }
  }

  cancelEditing() {
    const project = this.currentProject()

    if (project?.isDraft) {
      this.items.splice(this.selectedIndex, 1)
      this.selectedIndex = this.previousSelectedIndex || 0
      this.editing = false
      this.editingItem = null
      this.editingElement = null
      this.render()
      return
    }

    this.stopEditing(false)
  }

  stopEditing(shouldSave = true) {
    if (!this.editing) return

    if (shouldSave && this.editingElement) {
      this.commitEditing(this.editingElement)
    }

    if (this.editingElement) {
      this.editingElement.contentEditable = false
    }

    this.editing = false
    this.editingItem = null
    this.editingElement = null
  }

  async commitEditing(element) {
    const project = this.editingItem || this.currentProject()

    if (!project) return

    const title = element.textContent.trim()

    if (project.isDraft) {

      if (!title) {
        this.items.splice(this.selectedIndex, 1)
        this.selectedIndex = this.previousSelectedIndex || 0
        this.render()
        return
      }

      const response = await fetch('/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })

      if (!response.ok) return

      const created = await response.json()

      project.id = created.id
      project.title = title
      project.file = created.file || ''
      project.isDraft = false

      await this.reload({ selectedProjectId: created.id })
      return
    }

    project.title = title
  }

  async deleteSelectedItem() {
    this.items.splice(this.selectedIndex, 1)

    if (this.selectedIndex >= this.items.length) {
      this.selectedIndex = Math.max(0, this.items.length - 1)
    }

    this.render()
  }

  afterMoveItem() {
    this.render()
  }

  openSelectedProject() {
    const project = this.currentProject()

    if (!project || project.isDraft) return

    loadProject(project.id)
  }

  handleKeydown(event) {

    if (this.editing) {

      if (event.key === 'Escape') {
        event.preventDefault()
        this.cancelEditing()
        return true
      }

      return this.handleEditingKeydown(event)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      this.openSelectedProject()
      return true
    }

    return super.handleKeydown(event)
  }

  handleEditingKeydown(event) {

    if (event.key === 'Escape') {
      event.preventDefault()

      const project = this.currentProject()

      if (project?.isDraft) {
        this.items.splice(this.selectedIndex, 1)
        this.selectedIndex = this.previousSelectedIndex || 0

        this.editing = false
        this.editingItem = null
        this.editingElement = null

        this.render()
        return true
      }
    }

    return super.handleEditingKeydown(event)
  }

}

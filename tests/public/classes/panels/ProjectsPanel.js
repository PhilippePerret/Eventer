// AJOUTER CETTE MÉTHODE DANS ProjectsPanel.js

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

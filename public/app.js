const UI = {
  panel: null,
  mode: 'projects'
}

UI.renderFooter = function(){
  const footer = document.querySelector('#shortcuts-footer')
  if (!footer) return

  let mode = UI.mode || 'events'
  if (mode === 'events') mode = currentPath ? 'eventsChild' : 'eventsRoot'
  const items = (window.APP_UI_MODES || {})[mode] || []

  footer.innerHTML = ''

  items.forEach(([key,label]) => {
    const span = document.createElement('span')
    const kbd = document.createElement('kbd')
    kbd.textContent = key
    span.appendChild(kbd)
    span.append(' ' + label)
    footer.appendChild(span)
  })
}

let DB
let eventsPanel
let projectsList = []
let selectedProjectIndex = 0
let currentBreadcrumbs = []
let currentProject = null
let currentPath = ''
let navigationStack = []
let saveTimer = null

function pathParam() {
  return currentPath ? `&path=${encodeURIComponent(currentPath)}` : ''
}

async function boot() {
  await renderProjects()
}

async function renderProjects() {
  UI.panel = null
  UI.mode = 'projects'
  UI.renderFooter()

  const main = document.querySelector('#events')
  main.innerHTML = ''
  main.classList.add('project-screen')

  const response = await fetch('/projects')
  const projects = await response.json()
  projectsList = projects
  selectedProjectIndex = 0

  const title = document.createElement('h1')
  title.className = 'project-title'
  title.textContent = 'Choisir un évènemencier'

  const list = document.createElement('div')
  list.className = 'project-list'

  projects.forEach((project, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'project-item'
    if (index === selectedProjectIndex) button.classList.add('selected')
    button.dataset.project = project.id

    const name = document.createElement('span')
    name.className = 'project-name'
    name.textContent = project.title || project.id

    const file = document.createElement('span')
    file.className = 'project-file'
    file.textContent = project.file

    button.append(name, file)
    button.addEventListener('click', () => {
      selectedProjectIndex = index
      renderProjectSelection()
      loadProject(project.id)
    })
    list.appendChild(button)
  })

  main.append(title, list)
}


function renderProjectSelection() {
  document.querySelectorAll('.project-item').forEach((button, index) => {
    button.classList.toggle('selected', index === selectedProjectIndex)
  })
}

function moveProjectSelection(delta) {
  if (!projectsList.length) return
  selectedProjectIndex = Math.max(0, Math.min(projectsList.length - 1, selectedProjectIndex + delta))
  renderProjectSelection()
}

function openSelectedProject() {
  const project = projectsList[selectedProjectIndex]
  if (project) loadProject(project.id)
}

function shortCrumbLabel(label, max = 34) {
  const value = String(label || '').trim()
  return value.length > max ? value.slice(0, max - 1).trim() + '…' : value
}

function renderBreadcrumbs() {
  const main = document.querySelector('#events')
  if (!main) return

  main.querySelectorAll('.eventer-breadcrumbs').forEach(node => node.remove())

  if (!currentProject || UI.mode === 'projects') return

  const nav = document.createElement('nav')
  nav.className = 'eventer-breadcrumbs'
  nav.setAttribute('aria-label', 'Fil d’Ariane')

  const crumbs = currentBreadcrumbs || []
  const currentIndex = Math.max(0, crumbs.length - 1)

  crumbs.forEach((crumb, index) => {
    if (index > 0) {
      const sep = document.createElement('span')
      sep.className = 'breadcrumb-separator'
      sep.textContent = '‹'
      nav.appendChild(sep)
    }

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'breadcrumb-item'
    if (index === currentIndex) button.classList.add('is-current')
    button.textContent = shortCrumbLabel(crumb.label || crumb.path || currentProject)
    button.title = crumb.label || crumb.path || currentProject
    button.disabled = (crumb.path || '') === currentPath
    button.addEventListener('click', async () => {
      currentPath = crumb.path || ''
      navigationStack = []
      await loadCurrentEventer()
    })
    nav.appendChild(button)
  })

  if (crumbs.length) {
    const tail = document.createElement('span')
    tail.className = 'breadcrumb-separator breadcrumb-tail'
    tail.textContent = '‹'
    nav.appendChild(tail)
  }

  main.prepend(nav)
}
async function loadProject(projectId) {
  currentProject = projectId
  currentPath = ''
  navigationStack = []
  await loadCurrentEventer()
}

async function loadCurrentEventer(selectedEventId = null) {
  const response = await fetch(`/events?project=${encodeURIComponent(currentProject)}${pathParam()}`)
  const data = await response.json()

  DB = new Database(data)
  DB.project = currentProject
  DB.path = currentPath
  currentBreadcrumbs = data.breadcrumbs || []

  const main = document.querySelector('#events')
  main.classList.remove('project-screen')

  eventsPanel = new EventsPanel(DB)

  if (selectedEventId) {
    const index = DB.evenements.findIndex(event => event.id === selectedEventId)
    if (index >= 0) eventsPanel.selectedIndex = index
  }

  UI.mode = 'events'
  eventsPanel.render()
  UI.renderFooter()
}


async function saveDatabaseForPath(path, database) {
  if (!currentProject || !database) return

  const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  await fetch(`/events?project=${encodeURIComponent(currentProject)}${suffix}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(database.toJSON())
  })
}

async function openChildEventer(event) {
  if (!event || !currentProject) return

  eventsPanel.stopEditing(true)

  const response = await fetch(`/child?project=${encodeURIComponent(currentProject)}${pathParam()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: event.id,
      title: event.text || event.id
    })
  })

  const data = await response.json()
  if (!data.path) return

  const parentPath = currentPath
  const parentDb = DB

  event.child = data.path
  await saveDatabaseForPath(parentPath, parentDb)

  navigationStack.push({ path: parentPath, selectedEventId: event.id })
  currentPath = data.path
  await loadCurrentEventer()
}

async function openParentEventer() {
  if (!currentPath) return

  const parts = currentPath.split('/').filter(Boolean)
  const selectedEventId = parts.pop() || null
  const parentPath = parts.join('/')

  const previous = navigationStack.length ? navigationStack.pop() : null
  currentPath = previous ? (previous.path || '') : parentPath
  await loadCurrentEventer(previous ? previous.selectedEventId : selectedEventId)
}
function scheduleSave() {
  if (!currentProject) return

  clearTimeout(saveTimer)
  saveTimer = setTimeout(save, 400)
}

async function save() {
  if (!currentProject || !DB) return

  await fetch(`/events?project=${encodeURIComponent(currentProject)}${pathParam()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(DB.toJSON())
  })
}

document.addEventListener('keydown', e => {
  if (UI.mode === 'projects') {
    if (e.key === 'ArrowUp') { e.preventDefault(); moveProjectSelection(-1); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveProjectSelection(1); return }
    if (e.key === 'Enter') { e.preventDefault(); openSelectedProject(); return }
    return
  }

  if (UI.panel) {
    UI.panel.handleKeydown(e)
    return
  }

  if (eventsPanel) eventsPanel.handleKeydown(e)
})

boot()

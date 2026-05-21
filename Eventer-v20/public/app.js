const UI = {
  panel: null,
  mode: 'events'
}

let DB
let eventsPanel

let saveTimer = null

async function boot() {

  const response =
    await fetch('/events')

  const data =
    await response.json()

  DB =
    new Database(data)

  eventsPanel =
    new EventsPanel(DB)

  eventsPanel.render()
  updateShortcutsFooter()

}

function scheduleSave() {

  clearTimeout(saveTimer)

  saveTimer =
    setTimeout(save, 400)

}

async function save() {

  await fetch('/events', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(
      DB.toJSON()
    )

  })

}

document.addEventListener(
  'keydown',
  e => {

    if (UI.panel) {

      UI.panel.handleKeydown(e)
      updateShortcutsFooter()

      return

    }

    eventsPanel.handleKeydown(e)
    updateShortcutsFooter()

  }
)

boot()

function setUIMode(mode) {
  UI.mode = mode || 'events'
  updateShortcutsFooter()
}

function shortcutsForCurrentMode() {
  if (UI.panel && typeof UI.panel.uiMode === 'function') {
    return APP_CONFIG.uiModes[UI.panel.uiMode()] || []
  }

  if (eventsPanel && typeof eventsPanel.uiMode === 'function') {
    return APP_CONFIG.uiModes[eventsPanel.uiMode()] || []
  }

  return APP_CONFIG.uiModes[UI.mode] || APP_CONFIG.uiModes.events || []
}

function updateShortcutsFooter() {
  const footer = document.querySelector('#shortcuts-footer')
  if (!footer) return

  footer.innerHTML = ''

  shortcutsForCurrentMode().forEach(([keys, label]) => {
    const item = document.createElement('span')
    String(keys).split('/').forEach(key => {
      const kbd = document.createElement('kbd')
      kbd.textContent = key
      item.appendChild(kbd)
    })
    item.append(document.createTextNode(' ' + label))
    footer.appendChild(item)
  })
}

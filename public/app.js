const UI = {
  panel: null
}

UI.mode = 'events'

UI.renderFooter = function(){
  const footer = document.querySelector('#shortcuts-footer')
  if (!footer) return

  let mode = UI.mode || 'events'
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
  UI.renderFooter()

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

      return

    }

    eventsPanel.handleKeydown(e)

  }
)

boot()
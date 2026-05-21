const UI = {
  panel: null
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
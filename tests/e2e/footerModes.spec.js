import { test, expect } from '@playwright/test'

const PROJECT = 'digestmd5'

function eventerData(overrides = {}) {
  return {
    title: overrides.title || 'Digest / MD5',
    options: { colorizeEventsWithFirstBrin: true, ...(overrides.options || {}) },
    personnages: overrides.personnages || [],
    brins: overrides.brins || [],
    evenements: overrides.evenements || []
  }
}

function event(overrides = {}) {
  return {
    id: overrides.id || 'test-footer-event',
    text: overrides.text || 'Event pour footer',
    brins: overrides.brins || [],
    persos: overrides.persos || [],
    checked: overrides.checked || false,
    state: overrides.state || '---',
    type: overrides.type || '',
    duration: overrides.duration ?? null,
    file: overrides.file || '',
    child: overrides.child || ''
  }
}

async function readEventer(request) {
  const response = await request.get(`/events?project=${PROJECT}`)
  expect(response.ok()).toBeTruthy()
  return response.json()
}

async function writeEventer(request, data) {
  const response = await request.post(`/events?project=${PROJECT}`, { data })
  expect(response.ok()).toBeTruthy()
}

async function openDigestProject(page) {
  await page.goto('/')
  await page.locator('.project-item', { hasText: 'digestmd5.json' }).click()
  await expect(page.locator('.event').first()).toBeVisible()
}

test('footer aide passe du mode events au mode édition puis revient au mode events', async ({ page, request }) => {
  const originalData = await readEventer(request)

  try {
    await writeEventer(request, eventerData({
      evenements: [event({ id: 'test-footer-event', text: 'Event pour footer' })]
    }))

    await openDigestProject(page)

    const footer = page.locator('#shortcuts-footer')
    await expect(footer).toContainText('↑ ↓')
    await expect(footer).toContainText('choisir')
    await expect(footer).toContainText('Entrée')
    await expect(footer).toContainText('éditer')
    await expect(footer).toContainText('→')
    await expect(footer).toContainText('Évènements')
    await expect(footer).not.toContainText('Tab')

    await page.keyboard.press('Enter')

    await expect(footer).toContainText('Tab')
    await expect(footer).toContainText('propriété suivante')
    await expect(footer).toContainText('Entrée')
    await expect(footer).toContainText('confirmer')
    await expect(footer).toContainText('Esc')
    await expect(footer).toContainText('annuler')
    await expect(footer).not.toContainText('→')
    await expect(footer).not.toContainText('Évènements')

    await page.keyboard.press('Enter')

    await expect(footer).toContainText('↑ ↓')
    await expect(footer).toContainText('choisir')
    await expect(footer).toContainText('→')
    await expect(footer).toContainText('Évènements')
    await expect(footer).not.toContainText('Tab')
  } finally {
    await writeEventer(request, originalData)
  }
})

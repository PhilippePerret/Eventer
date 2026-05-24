import { test, expect } from '@playwright/test'

const PROJECT = 'digestmd5'
const PARENT_EVENT_ID = 'test-navigation-parent'
const CHILD_PATH = PARENT_EVENT_ID

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
    id: overrides.id || crypto.randomUUID(),
    text: overrides.text || '',
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

async function readEventer(request, path = '') {
  const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  const response = await request.get(`/events?project=${PROJECT}${suffix}`)
  expect(response.ok()).toBeTruthy()
  return response.json()
}

async function writeEventer(request, data, path = '') {
  const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  const response = await request.post(`/events?project=${PROJECT}${suffix}`, { data })
  expect(response.ok()).toBeTruthy()
}

async function openDigestProject(page) {
  await page.goto('/')
  await page.locator('.project-item', { hasText: 'digestmd5.json' }).click()
  await expect(page.locator('.event').first()).toBeVisible()
}

test('flèche droite ouvre l’évènemencier enfant et flèche gauche revient au parent', async ({ page, request }) => {
  const originalRoot = await readEventer(request)
  const originalChild = await readEventer(request, CHILD_PATH).catch(() => null)

  try {
    await writeEventer(request, eventerData({
      evenements: [
        event({
          id: PARENT_EVENT_ID,
          text: 'Parent pour test navigation',
          child: CHILD_PATH
        }),
        event({ id: 'test-navigation-other', text: 'Autre event parent' })
      ]
    }))

    await writeEventer(request, eventerData({
      title: 'Parent pour test navigation',
      evenements: [event({ id: 'test-navigation-child-event', text: 'Event enfant visible' })]
    }), CHILD_PATH)

    await openDigestProject(page)
    await expect(page.locator('.event').first()).toContainText('Parent pour test navigation')
    await expect(page.locator('#shortcuts-footer')).toContainText('→')
    await expect(page.locator('#shortcuts-footer')).not.toContainText('←')

    await page.keyboard.press('ArrowRight')

    await expect(page.locator('.event').first()).toContainText('Event enfant visible')
    await expect(page.locator('.eventer-breadcrumbs')).toBeVisible()
    await expect(page.locator('.eventer-breadcrumbs')).toContainText('Digest / MD5')
    await expect(page.locator('.eventer-breadcrumbs')).toContainText('Parent pour test navigation')
    await expect(page.locator('#shortcuts-footer')).toContainText('←')
    await expect(page.locator('#shortcuts-footer')).toContainText('parent')

    await page.keyboard.press('ArrowLeft')

    await expect(page.locator('.event').first()).toContainText('Parent pour test navigation')
    await expect(page.locator('#shortcuts-footer')).not.toContainText('←')
    await expect(page.locator('.eventer-breadcrumbs')).toContainText('Digest / MD5')
  } finally {
    await writeEventer(request, originalRoot)
    if (originalChild) {
      await writeEventer(request, originalChild, CHILD_PATH)
    }
  }
})

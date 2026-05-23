import { expect } from '@playwright/test'

export const PROJECT = '__e2e__'
export const MODIFIER = process.platform === 'darwin' ? 'Meta' : 'Control'

export function blankEvent(overrides = {}) {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text: '',
    brins: [],
    persos: [],
    checked: false,
    state: '---',
    type: '',
    duration: null,
    file: '',
    child: '',
    childHasEvents: false,
    ...overrides
  }
}

export function eventerData(overrides = {}) {
  return {
    title: 'E2E',
    options: {
      colorizeEventsWithFirstBrin: true
    },
    personnages: [],
    brins: [],
    evenements: [],
    project: PROJECT,
    path: '',
    parentPath: '',
    breadcrumbs: [
      { label: 'E2E', path: '' }
    ],
    ...overrides
  }
}

export async function readEventer(request, { project = PROJECT, path = '' } = {}) {
  const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  const response = await request.get(`/events?project=${project}${suffix}`)
  expect(response.ok()).toBeTruthy()
  return response.json()
}

export async function writeEventer(request, data, { project = PROJECT, path = '' } = {}) {
  const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  const response = await request.post(`/events?project=${project}${suffix}`, { data })
  expect(response.ok()).toBeTruthy()
}

export async function openDigestProject(page) {
  await page.goto('/')
  await page.locator('.project-item', { hasText: '__e2e__.json' }).click()
  await expect(page.locator('.event').first()).toBeVisible()
}

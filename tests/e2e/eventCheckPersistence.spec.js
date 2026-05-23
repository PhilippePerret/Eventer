import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer } from './helpers.js'

test('la coche d’un event est persistée après rechargement', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'persist-check', text: 'Event persisté', checked: true })
      ]
    }), { project: PROJECT })

    await page.goto('/')
    await page.locator('.project-item', { hasText: '__e2e__.json' }).click()

    await expect(page.locator('.event').first()).toContainText('✓')

    await page.reload()
    await page.locator('.project-item', { hasText: '__e2e__.json' }).click()

    await expect(page.locator('.event').first()).toContainText('✓')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

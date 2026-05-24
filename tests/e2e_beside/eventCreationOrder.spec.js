import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('un nouvel event est créé après l’event courant', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'event-a', text: 'A' }),
        blankEvent({ id: 'event-b', text: 'B' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('n')

    const events = page.locator('.event')

    await expect(events).toHaveCount(3)
    await expect(events.nth(1)).toHaveClass(/selected/)
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

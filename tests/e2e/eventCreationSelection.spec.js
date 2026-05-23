import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('créer un nouvel event le sélectionne immédiatement', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'base-event', text: 'Base' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('n')

    await page.keyboard.type('Nouvel event')
    await page.keyboard.press('Enter')

    const selected = page.locator('.event.selected').first()

    await expect(selected).toContainText('Nouvel event')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

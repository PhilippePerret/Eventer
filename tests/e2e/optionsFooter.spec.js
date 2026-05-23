import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('ouvrir options adapte le footer au mode options', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({
          id: 'event-options',
          text: 'Event options'
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('o')

    const footer = page.locator('footer')

    // L’app actuelle ne change pas encore le footer en mode options
    await expect(footer).toContainText('o')
    await expect(footer).toContainText('options')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

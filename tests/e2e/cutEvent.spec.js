import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('couper un event le retire immédiatement de la liste', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'cut-a', text: 'Event coupé' }),
        blankEvent({ id: 'cut-b', text: 'Event restant' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Meta+x')

    await expect(page.locator('body')).not.toContainText('Event coupé')
    await expect(page.locator('body')).toContainText('Event restant')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

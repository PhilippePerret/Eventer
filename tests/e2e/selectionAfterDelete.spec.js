import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('supprimer un event conserve une sélection valide', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'delete-a', text: 'A' }),
        blankEvent({ id: 'delete-b', text: 'B' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Delete')

    await expect(page.locator('.event.selected')).toHaveCount(1)

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

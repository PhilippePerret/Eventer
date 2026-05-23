import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('fermer les options rend la main à la liste events', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'opt-a', text: 'Alpha' }),
        blankEvent({ id: 'opt-b', text: 'Beta' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('o')

    await expect(page.locator('body')).toContainText('Fermer')

    await page.keyboard.press('Escape')

    await page.keyboard.press('ArrowDown')

    const selected = page.locator('.event.selected').first()

    await expect(selected).toContainText('Beta')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

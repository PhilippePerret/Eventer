import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le filtrage conserve un event sélectionné', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'filter-a', text: 'Alpha' }),
        blankEvent({ id: 'filter-b', text: 'Bravo' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('/')

    await expect(page.locator('.event.selected')).toHaveCount(1)
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

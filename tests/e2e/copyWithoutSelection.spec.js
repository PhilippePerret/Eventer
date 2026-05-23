import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('sans coche, copier prend uniquement l’event courant', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'copy-a', text: 'Event A' }),
        blankEvent({ id: 'copy-b', text: 'Event B' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowDown')

    await page.keyboard.press('Meta+c')

    await page.keyboard.press('Meta+v')

    const content = await page.locator('body').textContent()

    const countB = (content.match(/Event B/g) || []).length

    expect(countB).toBe(2)

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

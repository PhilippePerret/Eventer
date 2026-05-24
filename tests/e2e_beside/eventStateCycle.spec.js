import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le state reste visible après navigation clavier', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'state-a', text: 'A', state: 'Ébauché' }),
        blankEvent({ id: 'state-b', text: 'B', state: 'À relire' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowDown')

    const second = page.locator('.event').nth(1)

    await expect(second).toContainText('À relire')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('ouvrir puis fermer options conserve la sélection event', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'sel-a', text: 'Premier event' }),
        blankEvent({ id: 'sel-b', text: 'Deuxième event' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    // sélectionner deuxième
    await page.keyboard.press('ArrowDown')

    const second = page.locator('.event').nth(1)

    await expect(second).toHaveClass(/selected/)

    // ouvrir options
    await page.keyboard.press('o')

    // fermer options
    await page.keyboard.press('Escape')

    // sélection toujours là
    await expect(second).toHaveClass(/selected/)
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

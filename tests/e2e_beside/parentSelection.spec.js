import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('ouvrir un enfant puis revenir conserve la sélection du parent', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'parent-a', text: 'Premier parent' }),
        blankEvent({ id: 'parent-b', text: 'Deuxième parent' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowDown')

    const second = page.locator('.event').nth(1)

    await expect(second).toHaveClass(/selected/)

    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')

    await expect(second).toHaveClass(/selected/)

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

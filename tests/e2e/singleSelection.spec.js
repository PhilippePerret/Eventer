import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('la navigation clavier conserve toujours un unique event sélectionné', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'nav-a', text: 'A' }),
        blankEvent({ id: 'nav-b', text: 'B' }),
        blankEvent({ id: 'nav-c', text: 'C' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')

    const selected = page.locator('.event.selected')

    await expect(selected).toHaveCount(1)
    await expect(selected).toContainText('C')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

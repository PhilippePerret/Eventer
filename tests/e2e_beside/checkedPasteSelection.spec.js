import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('coller des events cochés sélectionne le premier collé', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'cp-a', text: 'A', checked: true }),
        blankEvent({ id: 'cp-b', text: 'B', checked: true }),
        blankEvent({ id: 'cp-c', text: 'C' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Meta+c')

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')

    await page.keyboard.press('Meta+v')

    const selected = page.locator('.event.selected').first()

    await expect(selected).toContainText('A')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

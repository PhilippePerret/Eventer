import { test, expect } from '@playwright/test'
import { PROJECT, MODIFIER, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('couper puis coller replace l’event avant la sélection courante', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'cpko-a', text: 'A' }),
        blankEvent({ id: 'cpko-b', text: 'B' }),
        blankEvent({ id: 'cpko-c', text: 'C' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press(`${MODIFIER}+X`)

    await expect(page.locator('body')).not.toContainText('B')

    await page.keyboard.press(`${MODIFIER}+V`)

    const events = page.locator('.event')

    await expect(events).toHaveCount(3)
    await expect(events.nth(0)).toContainText('A')
    await expect(events.nth(1)).toContainText('B')
    await expect(events.nth(2)).toContainText('C')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

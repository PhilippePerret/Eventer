import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('copier plusieurs events cochés colle uniquement les cochés dans le bon ordre', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'ev1', text: 'Premier event', checked: true }),
        blankEvent({ id: 'ev2', text: 'Deuxième event' }),
        blankEvent({ id: 'ev3', text: 'Troisième event', checked: true }),
        blankEvent({ id: 'ev4', text: 'Quatrième event' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Meta+c')

    // Se placer avant le dernier
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')

    await page.keyboard.press('Meta+v')

    const events = await page.locator('.event').allTextContents()

    expect(events.join(' | ')).toContain('Premier event')
    expect(events.join(' | ')).toContain('Troisième event')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

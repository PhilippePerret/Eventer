import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('supprimer un event avec ⌦ met à jour la liste immédiatement', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'test-delete-event', text: 'Event à supprimer' }),
        blankEvent({ id: 'test-delete-keeper', text: 'Event conservé' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await expect(page.locator('.event')).toHaveCount(2)
    await expect(page.locator('.event').nth(0)).toHaveClass(/selected/)
    await expect(page.locator('.event').nth(0)).toContainText('Event à supprimer')

    await page.keyboard.press('Delete')

    await expect(page.locator('.event')).toHaveCount(1)
    await expect(page.locator('.event').first()).toContainText('Event conservé')
    await expect(page.locator('body')).not.toContainText('Event à supprimer')

    await page.waitForTimeout(700)

    const data = await readEventer(request, { project: PROJECT })
    expect(data.evenements.map(event => event.text)).toEqual(['Event conservé'])
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

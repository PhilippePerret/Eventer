import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('cocher un event met à jour visuellement la liste', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({
          id: 'event-check',
          text: 'Event cochable'
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    const event = page.locator('.event').first()

    await page.keyboard.press('Space')

    await expect(event).toContainText('✓')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

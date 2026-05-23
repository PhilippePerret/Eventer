import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('un event enfant vide ne montre pas la flèche enfant', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({
          id: 'event-no-child-arrow',
          text: 'Event sans enfant réel'
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    const event = page.locator('.event').first()

    await expect(event).toBeVisible()
    await expect(event).not.toContainText('↘')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

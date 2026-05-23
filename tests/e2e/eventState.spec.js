import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le state affiché sur un event correspond à sa valeur métier', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({
          id: 'state-event',
          text: 'Event état',
          state: 'À relire'
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    const event = page.locator('.event').first()

    await expect(event).toContainText('À relire')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

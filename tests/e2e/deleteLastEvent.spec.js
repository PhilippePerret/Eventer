import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('supprimer le dernier event laisse une vue stable', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'last-event', text: 'Dernier event' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Delete')

    await expect(page.locator('body')).not.toContainText('Dernier event')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

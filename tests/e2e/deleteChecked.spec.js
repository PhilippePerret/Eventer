import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('supprimer un event coché ne détruit pas les autres events', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'del-a', text: 'Event supprimé', checked: true }),
        blankEvent({ id: 'del-b', text: 'Event gardé' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Delete')

    await expect(page.locator('body')).not.toContainText('Event supprimé')
    await expect(page.locator('body')).toContainText('Event gardé')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

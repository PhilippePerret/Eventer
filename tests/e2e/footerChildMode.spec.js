import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le footer enfant affiche le raccourci retour', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'child-footer-parent', text: 'Parent footer enfant' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowRight')

    await expect(page.locator('#shortcuts-footer')).toContainText('←')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

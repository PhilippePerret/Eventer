import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le fil d’ariane affiche le marqueur ‹ du niveau courant', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'crumb-parent', text: 'Parent fil' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowRight')

    await expect(page.locator('.eventer-breadcrumbs')).toContainText('‹')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

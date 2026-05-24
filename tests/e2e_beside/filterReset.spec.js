import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le bouton tous les events réapparait après filtrage', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'filter-a', text: 'Alpha' }),
        blankEvent({ id: 'filter-b', text: 'Beta' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    // Le raccourci / ouvre actuellement le filtre brins
    await page.keyboard.press('/')

    await expect(page.locator('body')).toContainText('Filtrer par brins')
    await expect(page.locator('body')).toContainText('Fermer')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('le footer adapte les raccourcis quand un panneau brins est ouvert', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      brins: [
        { id: 'brin-footer', nom: 'Brin footer', badge: 'BRI', type: 'autre', color: '#cccccc', persos: [], file: '' }
      ],
      evenements: [
        blankEvent({
          id: 'event-footer',
          text: 'Event footer',
          brins: ['brin-footer']
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('b')

    const footer = page.locator('footer')

    await expect(footer).toContainText('Esc')
    await expect(footer).toContainText('Entrée')
    await expect(footer).toContainText('créer')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

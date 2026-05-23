import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('ouvrir le panneau des brins puis des personnages conserve le panneau brins au retour', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      personnages: [
        { id: 'test-panel-perso', badge: 'PER', avatar: '', pseudo: 'Perso panneau', patronyme: '', fonctions: [], file: '' }
      ],
      brins: [
        { id: 'test-panel-brin', nom: 'Brin panneau', badge: 'BRI', type: 'autre', color: '#d9c8a9', persos: ['test-panel-perso'], file: '' }
      ],
      evenements: [
        blankEvent({
          id: 'test-panel-event',
          text: 'Event pour panneaux',
          brins: ['test-panel-brin'],
          persos: []
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await expect(page.locator('.event')).toHaveCount(1)
    await expect(page.locator('.event').first()).toHaveClass(/selected/)

    await page.keyboard.press('b')

    await expect(page.locator('#panel-overlay')).not.toHaveClass(/hidden/)
    await expect(page.locator('#panel .panel-title')).toContainText('Brins')
    await expect(page.locator('#panel')).toContainText('Brin panneau')

    await page.keyboard.press('p')

    await expect(page.locator('#panel .panel-title')).toContainText('Personnages')
    await expect(page.locator('#panel')).toContainText('Perso panneau')

    await page.keyboard.press('Escape')

    await expect(page.locator('#panel-overlay')).not.toHaveClass(/hidden/)
    await expect(page.locator('#panel .panel-title')).toContainText('Brins')
    await expect(page.locator('#panel')).toContainText('Brin panneau')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

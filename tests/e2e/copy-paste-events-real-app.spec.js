import { test, expect } from '@playwright/test'
import { PROJECT, MODIFIER, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('copier/coller un event conserve ses propriétés métier dans l’application réelle', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      personnages: [
        { id: 'perso-copy', badge: 'PER', avatar: '', pseudo: 'Perso Copy', patronyme: '', fonctions: [], file: '' }
      ],
      brins: [
        { id: 'brin-copy', nom: 'Brin Copy', badge: 'BCP', type: 'autre', color: '#cccccc', persos: ['perso-copy'], file: '' }
      ],
      evenements: [
        blankEvent({ id: 'copy-a', text: 'Event à copier', brins: ['brin-copy'], persos: ['perso-copy'], state: 'À relire' }),
        blankEvent({ id: 'copy-b', text: 'Event repère' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press(`${MODIFIER}+C`)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press(`${MODIFIER}+V`)

    const events = page.locator('.event')

    await expect(events).toHaveCount(3)
    await expect(page.locator('body')).toContainText('BCP')
    await expect(page.locator('body')).toContainText('PER')
    await expect(page.locator('body')).toContainText('À relire')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

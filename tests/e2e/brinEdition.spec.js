import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('éditer un brin conserve ses personnages', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      personnages: [
        { id: 'perso-brin', badge: 'PER', avatar: '', pseudo: 'Perso Brin', patronyme: '', fonctions: [], file: '' }
      ],
      brins: [
        {
          id: 'brin-edit',
          nom: 'Brin initial',
          badge: 'BRI',
          type: 'autre',
          color: '#cccccc',
          persos: ['perso-brin'],
          file: ''
        }
      ],
      evenements: [
        blankEvent({
          id: 'event-brin',
          text: 'Event brin',
          brins: ['brin-edit']
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('b')
    await page.keyboard.press('Enter')

    await page.keyboard.type(' modifié')

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    await page.keyboard.press('Enter')

    await expect(page.locator('#panel')).toContainText('PER')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

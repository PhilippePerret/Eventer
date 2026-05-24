import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('éditer le texte d’un event conserve ses brins et persos', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      personnages: [
        { id: 'perso-edit', badge: 'PER', avatar: '', pseudo: 'Perso Edit', patronyme: '', fonctions: [], file: '' }
      ],
      brins: [
        {
          id: 'brin-edit',
          nom: 'Brin Edit',
          badge: 'BRE',
          type: 'autre',
          color: '#cccccc',
          persos: ['perso-edit'],
          file: ''
        }
      ],
      evenements: [
        blankEvent({
          id: 'event-edit',
          text: 'Texte initial',
          brins: ['brin-edit'],
          persos: ['perso-edit']
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Enter')
    await page.keyboard.type(' modifié')
    await page.keyboard.press('Enter')

    const event = page.locator('.event').first()

    await expect(event).toContainText('BRE')
    await expect(event).toContainText('PER')

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

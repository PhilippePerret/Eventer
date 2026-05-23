import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('les personnages propres à l’event apparaissent après ceux des brins', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      personnages: [
        { id: 'perso-brin', badge: 'BRI', avatar: '', pseudo: 'Perso brin', patronyme: '', fonctions: [], file: '' },
        { id: 'perso-event', badge: 'EVT', avatar: '', pseudo: 'Perso event', patronyme: '', fonctions: [], file: '' }
      ],
      brins: [
        {
          id: 'brin-order',
          nom: 'Brin ordre',
          badge: 'BRO',
          type: 'autre',
          color: '#cccccc',
          persos: ['perso-brin'],
          file: ''
        }
      ],
      evenements: [
        blankEvent({
          id: 'event-persos',
          text: 'Event persos',
          brins: ['brin-order'],
          persos: ['perso-event']
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    const content = await page.locator('.event').first().textContent()

    expect(content.indexOf('BRI')).toBeLessThan(content.indexOf('EVT'))

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

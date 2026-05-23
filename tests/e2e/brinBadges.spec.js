import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('les badges de brins apparaissent sur la ligne event', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      brins: [
        {
          id: 'brin-test',
          nom: 'Brin test',
          badge: 'BRT',
          type: 'autre',
          color: '#ffcc00',
          persos: [],
          file: ''
        }
      ],
      evenements: [
        blankEvent({
          id: 'event-brin',
          text: 'Event avec brin',
          brins: ['brin-test']
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    const event = page.locator('.event').first()

    await expect(event).toContainText('BRT')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

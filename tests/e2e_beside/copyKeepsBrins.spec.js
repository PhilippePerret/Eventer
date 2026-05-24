import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('copier/coller conserve les badges de brins', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      brins: [
        {
          id: 'brin-copy',
          nom: 'Brin copie',
          badge: 'BCP',
          type: 'autre',
          color: '#cccccc',
          persos: [],
          file: ''
        }
      ],
      evenements: [
        blankEvent({
          id: 'event-copy',
          text: 'Event brin',
          brins: ['brin-copy']
        })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('Meta+c')
    await page.keyboard.press('Meta+v')

    const body = await page.locator('body').textContent()

    const count = (body.match(/BCP/g) || []).length

    expect(count).toBeGreaterThanOrEqual(2)

  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

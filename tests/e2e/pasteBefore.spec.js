import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('coller avant insère réellement avant l’event courant', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'ev-a', text: 'AAA' }),
        blankEvent({ id: 'ev-b', text: 'BBB' }),
        blankEvent({ id: 'ev-c', text: 'CCC' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    // Copier AAA
    await page.keyboard.press('Meta+c')

    // Aller sur CCC
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')

    // Coller avant CCC
    await page.keyboard.press('Meta+v')

    const texts = await page.locator('.event').allTextContents()

    const joined = texts.join(' | ')

    expect(joined.indexOf('AAA')).toBeLessThan(joined.lastIndexOf('CCC'))
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

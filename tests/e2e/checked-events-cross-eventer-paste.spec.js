import { test, expect } from '@playwright/test'
import { PROJECT, MODIFIER, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('copier des events cochés puis les coller dans un autre évènemencier conserve ordre et propriétés', async ({ page, request }) => {
  const originalRoot = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      brins: [
        { id: 'cross-brin', nom: 'Brin cross', badge: 'CRS', type: 'autre', color: '#cccccc', persos: [], file: '' }
      ],
      evenements: [
        blankEvent({ id: 'cross-a', text: 'Cross A', checked: true, brins: ['cross-brin'], state: 'Ébauché' }),
        blankEvent({ id: 'cross-b', text: 'Cross B', checked: true }),
        blankEvent({ id: 'cross-parent', text: 'Parent cible', child: 'cross-parent', childHasEvents: true })
      ]
    }), { project: PROJECT })

    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'cross-child-target', text: 'Event cible enfant' })
      ],
      parentPath: ''
    }), { project: PROJECT, path: 'cross-parent' })

    await openDigestProject(page)

    await page.keyboard.press(`${MODIFIER}+C`)

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')

    await expect(page.locator('.event').first()).toContainText('Event cible enfant')

    await page.keyboard.press(`${MODIFIER}+V`)

    const body = await page.locator('body').textContent()
    expect(body.indexOf('Cross A')).toBeLessThan(body.indexOf('Cross B'))
    await expect(page.locator('body')).toContainText('CRS')
    await expect(page.locator('body')).toContainText('Ébauché')
  } finally {
    await writeEventer(request, originalRoot, { project: PROJECT })
  }
})

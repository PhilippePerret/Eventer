import { test, expect } from '@playwright/test'
import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'

test('ouvrir un évènemencier enfant crée/navigue, revient au parent, et n’affiche l’indicateur que si l’enfant contient un event réel', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: [
        blankEvent({ id: 'test-child-navigation-parent', text: 'Parent pour navigation enfant' }),
        blankEvent({ id: 'test-child-navigation-other', text: 'Autre event racine' })
      ]
    }), { project: PROJECT })

    await openDigestProject(page)

    await page.keyboard.press('ArrowRight')

    await expect(page.locator('.event')).toHaveCount(1)
    await expect(page.locator('.eventer-breadcrumbs')).toContainText('E2E')
    await expect(page.locator('.eventer-breadcrumbs')).toContainText('Parent pour navigation enfant')
    await expect(page.locator('#shortcuts-footer')).toContainText('←')

    await page.keyboard.press('ArrowLeft')

    await expect(page.locator('.event')).toHaveCount(2)
    await expect(page.locator('.event').first()).toContainText('Parent pour navigation enfant')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

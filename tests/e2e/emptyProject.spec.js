import { test, expect } from '@playwright/test'
import { PROJECT, eventerData, readEventer, writeEventer } from './helpers.js'

test('un projet vide reste ouvrable', async ({ page, request }) => {
  const originalData = await readEventer(request, { project: PROJECT })

  try {
    await writeEventer(request, eventerData({
      evenements: []
    }), { project: PROJECT })

    await page.goto('/')
    await page.locator('.project-item', { hasText: '__e2e__.json' }).click()

    await expect(page.locator('body')).toContainText('E2E')
  } finally {
    await writeEventer(request, originalData, { project: PROJECT })
  }
})

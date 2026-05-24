import { test, expect } from '@playwright/test'

test('Texte.normalizeIdentifier normalise un identifiant projet', async ({ page }) => {
  const value = await page.evaluate(() => {
    return Texte.normalizeIdentifier('Mon Projet Étrange !!!')
  })

  expect(value).toBe('mon-projet-etrange')
})

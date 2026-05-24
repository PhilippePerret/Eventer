import { test, expect } from '@playwright/test'

test('n depuis l’accueil crée un projet', async ({ page }) => {
  await page.goto('/')

  const countBefore = await page.locator('.project-item').count()

  await page.keyboard.press('n')

  await expect(page.locator('.project-item')).toHaveCount(countBefore + 1)
})

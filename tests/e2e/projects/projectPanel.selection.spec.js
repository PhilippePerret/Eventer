import { test, expect } from '@playwright/test'

test('cliquer un projet le sélectionne sans l’ouvrir', async ({ page }) => {
  await page.goto('/')

  const first = page.locator('.project-item').first()

  await first.click()

  await expect(first).toHaveClass(/selected/)
  await expect(page.locator('.event')).toHaveCount(0)
})

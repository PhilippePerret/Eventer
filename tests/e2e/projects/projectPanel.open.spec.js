import { test, expect } from '@playwright/test'

test('→ ouvre le projet sélectionné', async ({ page }) => {
  await page.goto('/')

  const first = page.locator('.project-item').first()

  await first.click()

  await page.keyboard.press('ArrowRight')

  await expect(page.locator('.event').first()).toBeVisible()
})

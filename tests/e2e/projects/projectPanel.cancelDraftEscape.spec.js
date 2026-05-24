import { test, expect } from '@playwright/test'

test('Escape annule un draft projet', async ({ page }) => {
  await page.goto('/')

  const before = await page.locator('.project-item').count()

  await page.keyboard.press('n')
  await page.keyboard.press('Escape')

  await expect(page.locator('.project-item')).toHaveCount(before)
})

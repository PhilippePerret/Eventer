import { test, expect } from '@playwright/test'

test('Enter avec nom vide annule le draft projet', async ({ page }) => {
  await page.goto('/')

  const before = await page.locator('.project-item').count()

  await page.keyboard.press('n')
  await page.keyboard.press('Enter')

  await expect(page.locator('.project-item')).toHaveCount(before)
})

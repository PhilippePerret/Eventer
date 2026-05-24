import { test, expect } from '@playwright/test'

test('n crée un nouveau projet', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  const before = await projects.count()

  await page.keyboard.press('n')

  await expect(projects).toHaveCount(before + 1)
})

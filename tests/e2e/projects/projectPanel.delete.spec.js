import { test, expect } from '@playwright/test'

test('Delete masque le projet sélectionné', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  const before = await projects.count()

  await projects.first().click()

  await page.keyboard.press('Delete')

  await expect(projects).toHaveCount(before - 1)
})

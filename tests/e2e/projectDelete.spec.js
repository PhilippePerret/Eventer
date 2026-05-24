import { test, expect } from '@playwright/test'

test('delete depuis l’accueil masque un projet', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  const countBefore = await projects.count()

  await page.keyboard.press('Delete')

  await expect(projects).toHaveCount(countBefore - 1)
})

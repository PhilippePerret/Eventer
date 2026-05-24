import { test, expect } from '@playwright/test'

test('un projet actif est ouvrable depuis l’accueil', async ({ page }) => {
  await page.goto('/')

  const project = page.locator('.project-item').first()

  await expect(project).toBeVisible()

  await project.click()

  await expect(page.locator('.event').first()).toBeVisible()
})

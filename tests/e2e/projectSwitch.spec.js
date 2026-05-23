import { test, expect } from '@playwright/test'

test('le projet de test E2E est ouvrable depuis l’accueil', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')

  await expect(projects).toHaveCount(2)

  await page.locator('.project-item', { hasText: '__e2e__.json' }).click()

  await expect(page.locator('body')).toContainText('E2E')
  await expect(page.locator('.event').first()).toBeVisible()
})

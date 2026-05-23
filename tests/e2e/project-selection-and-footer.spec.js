import { test, expect } from '@playwright/test'

test('la page de départ permet de choisir un projet au clavier et affiche une aide adaptée', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  await expect(projects).toHaveCount(2)

  await expect(projects.nth(0)).toHaveClass(/selected/)
  await expect(page.locator('#shortcuts-footer')).toContainText('↑ ↓')

  await page.locator('.project-item', { hasText: '__e2e__.json' }).click()

  await expect(page.locator('.event').first()).toBeVisible()
  await expect(page.locator('#shortcuts-footer')).toContainText('→')
  await expect(page.locator('#shortcuts-footer')).toContainText('Évènements')
  await expect(page.locator('#shortcuts-footer')).not.toContainText('←')
})

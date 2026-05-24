import { test, expect } from '@playwright/test'

test('la page de départ affiche les raccourcis projets', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.project-item')).not.toHaveCount(0)

  await expect(page.locator('#shortcuts-footer')).toContainText('↑ ↓')
  await expect(page.locator('#shortcuts-footer')).toContainText('n')
  await expect(page.locator('#shortcuts-footer')).toContainText('⌘↑')
  await expect(page.locator('#shortcuts-footer')).toContainText('⌘↓')
  await expect(page.locator('#shortcuts-footer')).toContainText('⌦')
  await expect(page.locator('#shortcuts-footer')).toContainText('→')
})

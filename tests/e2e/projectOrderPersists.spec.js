import { test, expect } from '@playwright/test'

test('l’ordre des projets déplacés est conservé après rechargement', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  const count = await projects.count()
  expect(count).toBeGreaterThanOrEqual(2)

  const firstText = await projects.nth(0).textContent()
  const secondText = await projects.nth(1).textContent()

  await page.keyboard.press('Meta+ArrowDown')

  await expect(projects.nth(0)).toContainText(secondText || '')
  await expect(projects.nth(1)).toContainText(firstText || '')

  await page.reload()

  const reloaded = page.locator('.project-item')

  await expect(reloaded.nth(0)).toContainText(secondText || '')
  await expect(reloaded.nth(1)).toContainText(firstText || '')

  await page.keyboard.press('Meta+ArrowUp')
})

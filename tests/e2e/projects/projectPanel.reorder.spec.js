import { test, expect } from '@playwright/test'

test('⌘↓ déplace un projet', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')

  const firstText = await projects.nth(0).textContent()
  const secondText = await projects.nth(1).textContent()

  await projects.first().click()

  await page.keyboard.press('Meta+ArrowDown')

  await expect(projects.nth(0)).toContainText(secondText || '')
  await expect(projects.nth(1)).toContainText(firstText || '')
})

import { test, expect } from '@playwright/test'

test('cmd+flèche bas puis cmd+flèche haut déplacent un projet dans la liste', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')

  const count = await projects.count()
  expect(count).toBeGreaterThanOrEqual(2)

  const firstText = await projects.nth(0).textContent()
  const secondText = await projects.nth(1).textContent()

  await page.keyboard.press('Meta+ArrowDown')

  await expect(projects.nth(0)).toContainText(secondText || '')
  await expect(projects.nth(1)).toContainText(firstText || '')

  await page.keyboard.press('Meta+ArrowUp')

  await expect(projects.nth(0)).toContainText(firstText || '')
  await expect(projects.nth(1)).toContainText(secondText || '')

  await page.reload()

  const reloadedProjects = page.locator('.project-item')

  await expect(reloadedProjects.nth(0)).toContainText(firstText || '')
  await expect(reloadedProjects.nth(1)).toContainText(secondText || '')
})

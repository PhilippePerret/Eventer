import { test, expect } from '@playwright/test'

test('n crée un draft uniquement dans l’interface', async ({ page, request }) => {
  await page.goto('/')

  const before = await page.locator('.project-item').count()

  await page.keyboard.press('n')

  await expect(page.locator('.project-item')).toHaveCount(before + 1)

  const draft = page.locator('.project-item.selected').last()

  await expect(draft).toHaveClass(/editing/)

  const response = await request.get('/projects')
  const projects = await response.json()

  expect(projects.length).toBe(before)
})

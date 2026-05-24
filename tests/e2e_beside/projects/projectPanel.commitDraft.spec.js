import { test, expect } from '@playwright/test'

test('Enter valide crée réellement le projet', async ({ page, request }) => {
  await page.goto('/')

  const before = await page.locator('.project-item').count()

  await page.keyboard.press('n')

  await page.keyboard.type('Mon Projet Étrange')
  await page.keyboard.press('Enter')

  await expect(page.locator('.project-item')).toHaveCount(before + 1)

  const response = await request.get('/projects')
  const projects = await response.json()

  const created = projects.find(project => project.id === 'mon-projet-etrange')

  expect(created).toBeTruthy()
})

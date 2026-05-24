import { test, expect } from '@playwright/test'

test('supprimer un projet depuis l’accueil le rend inactif sans le détruire physiquement', async ({ page, request }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  const countBefore = await projects.count()

  const selectedText = (await projects.first().textContent()) || ''
  const projectName = selectedText.match(/[\w.-]+\.json/)?.[0]
  expect(projectName).toBeTruthy()

  await page.keyboard.press('Delete')

  await expect(page.locator('.project-item')).toHaveCount(countBefore - 1)

  const response = await request.get(`/events?project=${projectName.replace(/\.json$/, '')}`)
  expect(response.ok()).toBeTruthy()

  const data = await response.json()
  expect(data.active).toBe(false)
})

import { test, expect } from '@playwright/test'

test('créer un projet depuis l’accueil crée un fichier json et un dossier associés', async ({ page, request }) => {
  await page.goto('/')

  const countBefore = await page.locator('.project-item').count()

  await page.keyboard.press('n')

  await expect(page.locator('.project-item')).toHaveCount(countBefore + 1)

  const createdProject = page.locator('.project-item').nth(countBefore)
  await expect(createdProject).toBeVisible()

  const projectText = (await createdProject.textContent()) || ''
  expect(projectText).toContain('.json')

  const projectName = projectText.match(/[\w.-]+\.json/)?.[0]
  expect(projectName).toBeTruthy()

  const response = await request.get(`/events?project=${projectName.replace(/\.json$/, '')}`)
  expect(response.ok()).toBeTruthy()
})

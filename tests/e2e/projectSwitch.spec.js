import { test, expect } from '@playwright/test'

test('un projet actif est ouvrable depuis l’accueil', async ({ page }) => {
  await page.goto('/')

  const projects = page.locator('.project-item')
  const count = await projects.count()

  expect(count).toBeGreaterThan(0)

  let opened = false

  for (let i = 0; i < count; i++) {
    await projects.nth(i).click()

    const events = page.locator('.event')

    if (await events.count() > 0) {
      await expect(events.first()).toBeVisible()
      opened = true
      break
    }

    await page.goto('/')
  }

  expect(opened).toBeTruthy()
})

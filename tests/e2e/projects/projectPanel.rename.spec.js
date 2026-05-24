import { test, expect } from '@playwright/test'

test('Entrée édite le nom du projet', async ({ page }) => {
  await page.goto('/')

  const first = page.locator('.project-item').first()

  await first.click()

  await page.keyboard.press('Enter')

  const editable = first.locator('[contenteditable="true"]')

  await expect(editable).toBeVisible()
})

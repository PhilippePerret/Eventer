# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectSwitch.spec.js >> un projet actif est ouvrable depuis l’accueil
- Location: e2e/projectSwitch.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.project-item').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.project-item').first()

```

```yaml
- main:
  - heading "Choisir un évènemencier" [level=1]
- contentinfo "Raccourcis clavier": ↑ ↓ choisir Entrée ouvrir n nouveau projet ⌘↑ ⌘↓ classer ⌦ supprimer → éditer
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('un projet actif est ouvrable depuis l’accueil', async ({ page }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const project = page.locator('.project-item').first()
  7  | 
> 8  |   await expect(project).toBeVisible()
     |                         ^ Error: expect(locator).toBeVisible() failed
  9  | 
  10 |   await project.click()
  11 | 
  12 |   await expect(page.locator('.event').first()).toBeVisible()
  13 | })
  14 | 
```
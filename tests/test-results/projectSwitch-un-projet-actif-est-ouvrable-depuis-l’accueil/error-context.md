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

Locator: locator('.event').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.event').first()

```

```yaml
- main:
  - navigation "Fil d’Ariane":
    - button "project-1779609080-2" [disabled]
    - text: ‹
- contentinfo "Raccourcis clavier": ↑ ↓ choisir Entrée éditer n nouvel event ⌘C copier ⌘X couper ⌘V coller avant ⌦ détruire b brins p personnages → Évènements / filtrer o options Espace cocher
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
  8  |   await expect(project).toBeVisible()
  9  | 
  10 |   await project.click()
  11 | 
> 12 |   await expect(page.locator('.event').first()).toBeVisible()
     |                                                ^ Error: expect(locator).toBeVisible() failed
  13 | })
  14 | 
```
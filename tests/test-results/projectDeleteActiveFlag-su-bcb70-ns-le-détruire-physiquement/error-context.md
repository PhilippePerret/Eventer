# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectDeleteActiveFlag.spec.js >> supprimer un projet depuis l’accueil le rend inactif sans le détruire physiquement
- Location: e2e/projectDeleteActiveFlag.spec.js:3:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.textContent: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('.project-item').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Choisir un évènemencier" [level=1] [ref=e3]
  - contentinfo "Raccourcis clavier" [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: ↑ ↓
      - text: choisir
    - generic [ref=e7]:
      - generic [ref=e8]: Entrée
      - text: ouvrir
    - generic [ref=e9]:
      - generic [ref=e10]: "n"
      - text: nouveau projet
    - generic [ref=e11]:
      - generic [ref=e12]: ⌘↑ ⌘↓
      - text: classer
    - generic [ref=e13]:
      - generic [ref=e14]: ⌦
      - text: supprimer
    - generic [ref=e15]:
      - generic [ref=e16]: →
      - text: éditer
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('supprimer un projet depuis l’accueil le rend inactif sans le détruire physiquement', async ({ page, request }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const projects = page.locator('.project-item')
  7  |   const countBefore = await projects.count()
  8  | 
> 9  |   const selectedText = (await projects.first().textContent()) || ''
     |                                                ^ Error: locator.textContent: Test timeout of 15000ms exceeded.
  10 |   const projectName = selectedText.match(/[\w.-]+\.json/)?.[0]
  11 |   expect(projectName).toBeTruthy()
  12 | 
  13 |   await page.keyboard.press('Delete')
  14 | 
  15 |   await expect(page.locator('.project-item')).toHaveCount(countBefore - 1)
  16 | 
  17 |   const response = await request.get(`/events?project=${projectName.replace(/\.json$/, '')}`)
  18 |   expect(response.ok()).toBeTruthy()
  19 | 
  20 |   const data = await response.json()
  21 |   expect(data.active).toBe(false)
  22 | })
  23 | 
```
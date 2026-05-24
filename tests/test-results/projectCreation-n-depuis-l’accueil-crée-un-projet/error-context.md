# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectCreation.spec.js >> n depuis l’accueil crée un projet
- Location: e2e/projectCreation.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-item')
Expected: 2
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-item')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Choisir un évènemencier" [level=1] [ref=e3]
    - button "E2E __e2e__.json" [ref=e5]:
      - generic [ref=e6]: E2E
      - generic [ref=e7]: __e2e__.json
  - contentinfo "Raccourcis clavier" [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]: ↑ ↓
      - text: choisir
    - generic [ref=e11]:
      - generic [ref=e12]: Entrée
      - text: ouvrir
    - generic [ref=e13]:
      - generic [ref=e14]: "n"
      - text: nouveau projet
    - generic [ref=e15]:
      - generic [ref=e16]: ⌘↑ ⌘↓
      - text: classer
    - generic [ref=e17]:
      - generic [ref=e18]: ⌦
      - text: supprimer
    - generic [ref=e19]:
      - generic [ref=e20]: →
      - text: éditer
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('n depuis l’accueil crée un projet', async ({ page }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const countBefore = await page.locator('.project-item').count()
  7  | 
  8  |   await page.keyboard.press('n')
  9  | 
> 10 |   await expect(page.locator('.project-item')).toHaveCount(countBefore + 1)
     |                                               ^ Error: expect(locator).toHaveCount(expected) failed
  11 | })
  12 | 
```
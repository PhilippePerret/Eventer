# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectSwitch.spec.js >> un projet actif est ouvrable depuis l’accueil
- Location: e2e/projectSwitch.spec.js:3:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Choisir un évènemencier" [level=1] [ref=e3]
    - generic [ref=e4]:
      - button "project-1779611575-2 project-1779611575-2.json" [ref=e5]:
        - generic [ref=e6]: project-1779611575-2
        - generic [ref=e7]: project-1779611575-2.json
      - button "project-1779611575 project-1779611575.json" [ref=e8]:
        - generic [ref=e9]: project-1779611575
        - generic [ref=e10]: project-1779611575.json
      - button "digestmd5 digestmd5.json" [ref=e11]:
        - generic [ref=e12]: digestmd5
        - generic [ref=e13]: digestmd5.json
  - contentinfo "Raccourcis clavier" [ref=e14]:
    - generic [ref=e15]:
      - generic [ref=e16]: ↑ ↓
      - text: choisir
    - generic [ref=e17]:
      - generic [ref=e18]: Entrée
      - text: ouvrir
    - generic [ref=e19]:
      - generic [ref=e20]: "n"
      - text: nouveau projet
    - generic [ref=e21]:
      - generic [ref=e22]: ⌘↑ ⌘↓
      - text: classer
    - generic [ref=e23]:
      - generic [ref=e24]: ⌦
      - text: supprimer
    - generic [ref=e25]:
      - generic [ref=e26]: →
      - text: éditer
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('un projet actif est ouvrable depuis l’accueil', async ({ page }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const projects = page.locator('.project-item')
  7  |   const count = await projects.count()
  8  | 
  9  |   expect(count).toBeGreaterThan(0)
  10 | 
  11 |   let opened = false
  12 | 
  13 |   for (let i = 0; i < count; i++) {
  14 |     await projects.nth(i).click()
  15 | 
  16 |     const events = page.locator('.event')
  17 | 
  18 |     if (await events.count() > 0) {
  19 |       await expect(events.first()).toBeVisible()
  20 |       opened = true
  21 |       break
  22 |     }
  23 | 
  24 |     await page.goto('/')
  25 |   }
  26 | 
> 27 |   expect(opened).toBeTruthy()
     |                  ^ Error: expect(received).toBeTruthy()
  28 | })
  29 | 
```
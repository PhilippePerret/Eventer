# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectDeleteActiveFlag.spec.js >> supprimer un projet depuis l’accueil le rend inactif sans le détruire physiquement
- Location: e2e/projectDeleteActiveFlag.spec.js:3:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Choisir un évènemencier" [level=1] [ref=e3]
    - generic [ref=e4]:
      - button "project-1779608641 project-1779608641.json" [ref=e5]:
        - generic [ref=e6]: project-1779608641
        - generic [ref=e7]: project-1779608641.json
      - button "project-1779608641-2 project-1779608641-2.json" [ref=e8]:
        - generic [ref=e9]: project-1779608641-2
        - generic [ref=e10]: project-1779608641-2.json
      - button "digestmd5 digestmd5.json" [ref=e11]:
        - generic [ref=e12]: digestmd5
        - generic [ref=e13]: digestmd5.json
    - button "Annuler" [ref=e14] [cursor=pointer]
  - contentinfo "Raccourcis clavier" [ref=e15]:
    - generic [ref=e16]:
      - generic [ref=e17]: ↑ ↓
      - text: choisir
    - generic [ref=e18]:
      - generic [ref=e19]: Entrée
      - text: ouvrir
    - generic [ref=e20]:
      - generic [ref=e21]: "n"
      - text: nouveau projet
    - generic [ref=e22]:
      - generic [ref=e23]: ⌘↑ ⌘↓
      - text: classer
    - generic [ref=e24]:
      - generic [ref=e25]: ⌦
      - text: supprimer
    - generic [ref=e26]:
      - generic [ref=e27]: →
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
  9  |   const selectedText = (await projects.first().textContent()) || ''
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
> 21 |   expect(data.active).toBe(false)
     |                       ^ Error: expect(received).toBe(expected) // Object.is equality
  22 | })
  23 | 
```
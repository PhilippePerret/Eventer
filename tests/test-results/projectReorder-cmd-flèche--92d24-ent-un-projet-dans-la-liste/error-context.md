# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectReorder.spec.js >> cmd+flèche bas puis cmd+flèche haut déplacent un projet dans la liste
- Location: e2e/projectReorder.spec.js:3:1

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 2
Received:    0
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
  3  | test('cmd+flèche bas puis cmd+flèche haut déplacent un projet dans la liste', async ({ page }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const projects = page.locator('.project-item')
  7  | 
  8  |   const count = await projects.count()
> 9  |   expect(count).toBeGreaterThanOrEqual(2)
     |                 ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  10 | 
  11 |   const firstText = await projects.nth(0).textContent()
  12 |   const secondText = await projects.nth(1).textContent()
  13 | 
  14 |   await page.keyboard.press('Meta+ArrowDown')
  15 | 
  16 |   await expect(projects.nth(0)).toContainText(secondText || '')
  17 |   await expect(projects.nth(1)).toContainText(firstText || '')
  18 | 
  19 |   await page.keyboard.press('Meta+ArrowUp')
  20 | 
  21 |   await expect(projects.nth(0)).toContainText(firstText || '')
  22 |   await expect(projects.nth(1)).toContainText(secondText || '')
  23 | 
  24 |   await page.reload()
  25 | 
  26 |   const reloadedProjects = page.locator('.project-item')
  27 | 
  28 |   await expect(reloadedProjects.nth(0)).toContainText(firstText || '')
  29 |   await expect(reloadedProjects.nth(1)).toContainText(secondText || '')
  30 | })
  31 | 
```
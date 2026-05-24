# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectCreationDisk.spec.js >> créer un projet depuis l’accueil crée un fichier json et un dossier associés
- Location: e2e/projectCreationDisk.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-item')
Expected: 9
Received: 8
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-item')
    - locator resolved to 0 elements
    - unexpected value "0"
    13 × locator resolved to 8 elements
       - unexpected value "8"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Choisir un évènemencier" [level=1] [ref=e3]
    - generic [ref=e4]:
      - button "project-1779597633 project-1779597633.json" [ref=e5]:
        - generic [ref=e6]: project-1779597633
        - generic [ref=e7]: project-1779597633.json
      - button "project-1779598203 project-1779598203.json" [ref=e8]:
        - generic [ref=e9]: project-1779598203
        - generic [ref=e10]: project-1779598203.json
      - button "E2E __e2e__.json" [ref=e11]:
        - generic [ref=e12]: E2E
        - generic [ref=e13]: __e2e__.json
      - button "digestmd5 digestmd5.json" [ref=e14]:
        - generic [ref=e15]: digestmd5
        - generic [ref=e16]: digestmd5.json
      - button "projet-20260524-062259projet-20260524-062259 projet-20260524-062259projet-20260524-062259.json" [ref=e17]:
        - generic [ref=e18]: projet-20260524-062259projet-20260524-062259
        - generic [ref=e19]: projet-20260524-062259projet-20260524-062259.json
      - button "projet-20260524-062633 projet-20260524-062633.json" [ref=e20]:
        - generic [ref=e21]: projet-20260524-062633
        - generic [ref=e22]: projet-20260524-062633.json
      - button "projet-20260524-062633-2 projet-20260524-062633-2.json" [ref=e23]:
        - generic [ref=e24]: projet-20260524-062633-2
        - generic [ref=e25]: projet-20260524-062633-2.json
      - button "projet-20260524-062633-2projet-20260524-062633-2 projet-20260524-062633-2projet-20260524-062633-2.json" [ref=e26]:
        - generic [ref=e27]: projet-20260524-062633-2projet-20260524-062633-2
        - generic [ref=e28]: projet-20260524-062633-2projet-20260524-062633-2.json
  - contentinfo "Raccourcis clavier" [ref=e29]:
    - generic [ref=e30]:
      - generic [ref=e31]: ↑ ↓
      - text: choisir
    - generic [ref=e32]:
      - generic [ref=e33]: Entrée
      - text: ouvrir
    - generic [ref=e34]:
      - generic [ref=e35]: "n"
      - text: nouveau projet
    - generic [ref=e36]:
      - generic [ref=e37]: ⌘↑ ⌘↓
      - text: classer
    - generic [ref=e38]:
      - generic [ref=e39]: ⌦
      - text: supprimer
    - generic [ref=e40]:
      - generic [ref=e41]: →
      - text: éditer
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('créer un projet depuis l’accueil crée un fichier json et un dossier associés', async ({ page, request }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const countBefore = await page.locator('.project-item').count()
  7  | 
  8  |   await page.keyboard.press('n')
  9  | 
> 10 |   await expect(page.locator('.project-item')).toHaveCount(countBefore + 1)
     |                                               ^ Error: expect(locator).toHaveCount(expected) failed
  11 | 
  12 |   const createdProject = page.locator('.project-item').nth(countBefore)
  13 |   await expect(createdProject).toBeVisible()
  14 | 
  15 |   const projectText = (await createdProject.textContent()) || ''
  16 |   expect(projectText).toContain('.json')
  17 | 
  18 |   const projectName = projectText.match(/[\w.-]+\.json/)?.[0]
  19 |   expect(projectName).toBeTruthy()
  20 | 
  21 |   const response = await request.get(`/events?project=${projectName.replace(/\.json$/, '')}`)
  22 |   expect(response.ok()).toBeTruthy()
  23 | })
  24 | 
```
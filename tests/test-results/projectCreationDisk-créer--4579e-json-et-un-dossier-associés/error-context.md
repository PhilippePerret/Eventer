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
Expected: 12
Received: 11
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-item')
    14 × locator resolved to 11 elements
       - unexpected value "11"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Choisir un évènemencier" [level=1] [ref=e3]
    - generic [ref=e4]:
      - button "E2E __e2e__.json" [ref=e5]:
        - generic [ref=e6]: E2E
        - generic [ref=e7]: __e2e__.json
      - button "__state__ __state__.json" [ref=e8]:
        - generic [ref=e9]: __state__
        - generic [ref=e10]: __state__.json
      - button "digestmd5 digestmd5.json" [ref=e11]:
        - generic [ref=e12]: digestmd5
        - generic [ref=e13]: digestmd5.json
      - button "projet-20260524-061037 projet-20260524-061037.json" [ref=e14]:
        - generic [ref=e15]: projet-20260524-061037
        - generic [ref=e16]: projet-20260524-061037.json
      - button "projet-20260524-061830 projet-20260524-061830.json" [ref=e17]:
        - generic [ref=e18]: projet-20260524-061830
        - generic [ref=e19]: projet-20260524-061830.json
      - button "projet-20260524-062118 projet-20260524-062118.json" [ref=e20]:
        - generic [ref=e21]: projet-20260524-062118
        - generic [ref=e22]: projet-20260524-062118.json
      - button "projet-20260524-062259 projet-20260524-062259.json" [ref=e23]:
        - generic [ref=e24]: projet-20260524-062259
        - generic [ref=e25]: projet-20260524-062259.json
      - button "projet-20260524-062259projet-20260524-062259 projet-20260524-062259projet-20260524-062259.json" [ref=e26]:
        - generic [ref=e27]: projet-20260524-062259projet-20260524-062259
        - generic [ref=e28]: projet-20260524-062259projet-20260524-062259.json
      - button "projet-20260524-062633 projet-20260524-062633.json" [ref=e29]:
        - generic [ref=e30]: projet-20260524-062633
        - generic [ref=e31]: projet-20260524-062633.json
      - button "projet-20260524-062633-2 projet-20260524-062633-2.json" [ref=e32]:
        - generic [ref=e33]: projet-20260524-062633-2
        - generic [ref=e34]: projet-20260524-062633-2.json
      - button "projet-20260524-062633-2projet-20260524-062633-2 projet-20260524-062633-2projet-20260524-062633-2.json" [ref=e35]:
        - generic [ref=e36]: projet-20260524-062633-2projet-20260524-062633-2
        - generic [ref=e37]: projet-20260524-062633-2projet-20260524-062633-2.json
  - contentinfo "Raccourcis clavier" [ref=e38]:
    - generic [ref=e39]:
      - generic [ref=e40]: ↑ ↓
      - text: choisir
    - generic [ref=e41]:
      - generic [ref=e42]: Entrée
      - text: ouvrir
    - generic [ref=e43]:
      - generic [ref=e44]: "n"
      - text: nouveau projet
    - generic [ref=e45]:
      - generic [ref=e46]: ⌘↑ ⌘↓
      - text: classer
    - generic [ref=e47]:
      - generic [ref=e48]: ⌦
      - text: supprimer
    - generic [ref=e49]:
      - generic [ref=e50]: →
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
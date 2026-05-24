# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projectOrderPersists.spec.js >> l’ordre des projets déplacés est conservé après rechargement
- Location: e2e/projectOrderPersists.spec.js:3:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.project-item').first()
Expected substring: "project-1779598203project-1779598203.json"
Received string:    "project-1779597633project-1779597633.json"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.project-item').first()
    14 × locator resolved to <button type="button" class="project-item selected" data-project="project-1779597633">…</button>
       - unexpected value "project-1779597633project-1779597633.json"

```

```yaml
- button "project-1779597633 project-1779597633.json"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('l’ordre des projets déplacés est conservé après rechargement', async ({ page }) => {
  4  |   await page.goto('/')
  5  | 
  6  |   const projects = page.locator('.project-item')
  7  |   const count = await projects.count()
  8  |   expect(count).toBeGreaterThanOrEqual(2)
  9  | 
  10 |   const firstText = await projects.nth(0).textContent()
  11 |   const secondText = await projects.nth(1).textContent()
  12 | 
  13 |   await page.keyboard.press('Meta+ArrowDown')
  14 | 
  15 |   await expect(projects.nth(0)).toContainText(secondText || '')
  16 |   await expect(projects.nth(1)).toContainText(firstText || '')
  17 | 
  18 |   await page.reload()
  19 | 
  20 |   const reloaded = page.locator('.project-item')
  21 | 
> 22 |   await expect(reloaded.nth(0)).toContainText(secondText || '')
     |                                 ^ Error: expect(locator).toContainText(expected) failed
  23 |   await expect(reloaded.nth(1)).toContainText(firstText || '')
  24 | 
  25 |   await page.keyboard.press('Meta+ArrowUp')
  26 | })
  27 | 
```
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
Expected substring: "__state____state__.json"
Received string:    "E2E__e2e__.json"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.project-item').first()
    14 × locator resolved to <button type="button" data-project="__e2e__" class="project-item selected">…</button>
       - unexpected value "E2E__e2e__.json"

```

```yaml
- button "E2E __e2e__.json"
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
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: child-eventer-navigation.spec.js >> ouvrir un évènemencier enfant crée/navigue, revient au parent, et n’affiche l’indicateur que si l’enfant contient un event réel
- Location: e2e/child-eventer-navigation.spec.js:4:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.eventer-breadcrumbs')
Expected substring: "test-child-navigation-parent"
Received string:    "E2E‹Parent pour navigation enfant‹"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.eventer-breadcrumbs')
    14 × locator resolved to <nav aria-label="Fil d’Ariane" class="eventer-breadcrumbs">…</nav>
       - unexpected value "E2E‹Parent pour navigation enfant‹"

```

```yaml
- navigation "Fil d’Ariane":
  - button "E2E"
  - text: ‹
  - button "Parent pour navigation enfant" [disabled]
  - text: ‹
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { PROJECT, blankEvent, eventerData, readEventer, writeEventer, openDigestProject } from './helpers.js'
  3  | 
  4  | test('ouvrir un évènemencier enfant crée/navigue, revient au parent, et n’affiche l’indicateur que si l’enfant contient un event réel', async ({ page, request }) => {
  5  |   const originalData = await readEventer(request, { project: PROJECT })
  6  | 
  7  |   try {
  8  |     await writeEventer(request, eventerData({
  9  |       evenements: [
  10 |         blankEvent({ id: 'test-child-navigation-parent', text: 'Parent pour navigation enfant' }),
  11 |         blankEvent({ id: 'test-child-navigation-other', text: 'Autre event racine' })
  12 |       ]
  13 |     }), { project: PROJECT })
  14 | 
  15 |     await openDigestProject(page)
  16 | 
  17 |     await page.keyboard.press('ArrowRight')
  18 | 
  19 |     await expect(page.locator('.event')).toHaveCount(1)
  20 |     await expect(page.locator('.eventer-breadcrumbs')).toContainText('E2E')
> 21 |     await expect(page.locator('.eventer-breadcrumbs')).toContainText('test-child-navigation-parent')
     |                                                        ^ Error: expect(locator).toContainText(expected) failed
  22 |     await expect(page.locator('#shortcuts-footer')).toContainText('←')
  23 | 
  24 |     await page.keyboard.press('ArrowLeft')
  25 | 
  26 |     await expect(page.locator('.event')).toHaveCount(2)
  27 |     await expect(page.locator('.event').first()).toContainText('Parent pour navigation enfant')
  28 |   } finally {
  29 |     await writeEventer(request, originalData, { project: PROJECT })
  30 |   }
  31 | })
  32 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: singleSelection.spec.js >> la navigation clavier conserve toujours un unique event sélectionné
- Location: e2e/singleSelection.spec.js:4:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { expect } from '@playwright/test'
  2  | 
  3  | export const PROJECT = '__e2e__'
  4  | export const MODIFIER = process.platform === 'darwin' ? 'Meta' : 'Control'
  5  | 
  6  | export function blankEvent(overrides = {}) {
  7  |   return {
  8  |     id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  9  |     text: '',
  10 |     brins: [],
  11 |     persos: [],
  12 |     checked: false,
  13 |     state: '---',
  14 |     type: '',
  15 |     duration: null,
  16 |     file: '',
  17 |     child: '',
  18 |     childHasEvents: false,
  19 |     ...overrides
  20 |   }
  21 | }
  22 | 
  23 | export function eventerData(overrides = {}) {
  24 |   return {
  25 |     title: 'E2E',
  26 |     options: {
  27 |       colorizeEventsWithFirstBrin: true
  28 |     },
  29 |     personnages: [],
  30 |     brins: [],
  31 |     evenements: [],
  32 |     project: PROJECT,
  33 |     path: '',
  34 |     parentPath: '',
  35 |     breadcrumbs: [
  36 |       { label: 'E2E', path: '' }
  37 |     ],
  38 |     ...overrides
  39 |   }
  40 | }
  41 | 
  42 | export async function readEventer(request, { project = PROJECT, path = '' } = {}) {
  43 |   const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  44 |   const response = await request.get(`/events?project=${project}${suffix}`)
> 45 |   expect(response.ok()).toBeTruthy()
     |                         ^ Error: expect(received).toBeTruthy()
  46 |   return response.json()
  47 | }
  48 | 
  49 | export async function writeEventer(request, data, { project = PROJECT, path = '' } = {}) {
  50 |   const suffix = path ? `&path=${encodeURIComponent(path)}` : ''
  51 |   const response = await request.post(`/events?project=${project}${suffix}`, { data })
  52 |   expect(response.ok()).toBeTruthy()
  53 | }
  54 | 
  55 | export async function openDigestProject(page) {
  56 |   await page.goto('/')
  57 |   await page.locator('.project-item', { hasText: '__e2e__.json' }).click()
  58 |   await expect(page.locator('.event').first()).toBeVisible()
  59 | }
  60 | 
```
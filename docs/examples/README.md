# Recipes

Patterns built from Carved components that every application shapes differently. Copy a file into your project and make it yours: rename things, wire it to your API, change the layout in `recipes.css`.

| Recipe                                         | What it shows                                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`settings-form.tsx`](settings-form.tsx)       | Native validation, a pending save, a retryable error and an announced status              |
| [`confirm-action.tsx`](confirm-action.tsx)     | A destructive action confirmed in an `AlertDialog` that stays open while the request runs |
| [`searchable-table.tsx`](searchable-table.tsx) | A native table filtered by a `SearchField`, with a result count and an empty state        |
| [`empty-state.tsx`](empty-state.tsx)           | A quiet well that says what is missing and what to do                                     |
| [`app-shell.tsx`](app-shell.tsx)               | A workspace frame on `AppShell`: header, sidebar places, a trail and a heading            |

Storybook runs every recipe under **Recipes**, including the failure paths, and the documentation site shows each one live.

# Editable patterns

Copy these files into your app and own their behavior. They import the published core components; the Storybook laboratory executes the same source in success, error and keyboard scenarios.

- `settings-form.tsx`: labelled native validation, async save, pending state, retryable errors and status.
- `confirm-action.tsx`: focus-safe confirmation, async removal, prevention of dismissal while pending, retryable errors.
- `searchable-table.tsx`: native table, filtering, result announcements and an empty state.
- `app-shell.tsx`: native navigation, headings and a content region.

The `lab-*` / `example-shell` classes illustrate application-owned layout in Storybook's `laboratory.css`. Replace these with your application's CSS; controls ship their own styles. Replace sample domain values, strings and actions. Server-query pagination, authorization and data persistence belong to the application.

A source registry is deferred. These examples make the ownership boundary concrete without maintaining a second installation/release mechanism.

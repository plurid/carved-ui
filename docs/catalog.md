# Core catalog

The v1 core includes 36 component families, with compositional parts. Storybook is the executable catalog. Use its theme and direction toolbar to review every family in each preset and RTL.

| Group       | Components                                                             | Meaningful states                                                                                               |
| ----------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Actions     | Button, IconButton, Link                                               | Variants, sizes, keyboard, disabled, pending, long labels, icons                                                |
| Fields      | Form, TextField, Input, Textarea, Checkbox, RadioGroup, Switch, Slider | Controlled/uncontrolled, refs, validation, submission/reset, disabled/read-only, indeterminate/range            |
| Collections | Select, Combobox, Menu                                                 | Selection, filtering, empty/disabled items, section headers, separators, keyboard actions                       |
| Overlays    | Dialog, AlertDialog, Drawer, Popover, Tooltip                          | Naming/description, initial focus, containment/restoration, Escape, controlled open state, scoped portal themes |
| Navigation  | Tabs, Accordion, Breadcrumbs, Pagination                               | Arrow keys, expansion, disabled items, current page and native links                                            |
| Content     | Surface, Card, Heading, Separator, Badge, Avatar, Table                | Six nested depths, explicit depth, independent themes, headings, tone, initials/image fallback, caption/headers |
| Feedback    | Alert, Toast, Progress, Spinner, Skeleton, EmptyState                  | Semantic messages, queue/dismissal, determined/indeterminate, labelled loading, empty content/actions           |

Fields compose `Label`, `FieldDescription`, and `FieldError`; sliders compose tracks, thumbs and outputs. Collections compose values, list boxes, items, menus, sections, headers and **MenuSeparator** (use this collection-aware separator inside menus). Dialogs compose triggers, content, title, description and footer. Cards and tables expose native structural parts.

`DialogDescription` registers its ID with the enclosing dialog. Explicit `aria-describedby` on Dialog overrides the automatic association. Use an explicit short description or omit the description component for complex dialog content that should be read structurally.

## Completion contract

A new family needs a documented API, native or proven behavior, meaningful stories, disabled/error/loading states where applicable, controlled and uncontrolled examples for stateful inputs, associated labels, keyboard coverage, scoped theming, refs where useful, browser/package checks, and a changeset. Documentation alone is not evidence of accessibility.

The production core scope does not include data-grid virtualization, date/date-range pickers, file uploading, rich text editing, command palettes or domain entities. Build those as editable patterns above the core; introduce packaged behavior only when it is stable and widely reused.

Toast currently isolates React Aria's `UNSTABLE_Toast*` exports behind Carved names. The dependency is pinned. Treat upstream upgrades as an adapter/API review, and keep persistence-critical errors in the page rather than ephemeral notifications.

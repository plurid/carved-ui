# Accessibility

Carved builds its interactive components on React Aria, which provides keyboard interaction, focus management, screen reader semantics and internationalisation. Carved adds the material, and a theme engine that keeps it readable. This page says what is guaranteed, what is tested, and what stays your responsibility.

## Colour and contrast

Every theme, preset or generated, keeps these guarantees on all six depths:

| Colour                            | Against       | At least                                   |
| --------------------------------- | ------------- | ------------------------------------------ |
| Text (`--carved-fg-*`)            | its surface   | 4.5:1, and 7:1 wherever the surface allows |
| Muted text (`--carved-muted-*`)   | its surface   | 4.5:1                                      |
| Control edges (`--carved-edge-*`) | its surface   | 3:1                                        |
| Accent, success and danger fills  | every surface | 3:1                                        |
| Text on a fill (`--carved-on-*`)  | its fill      | 4.5:1                                      |
| Tone inks (`--carved-*-ink`)      | every surface | 4.5:1                                      |

Warning fills keep their amber hue, which cannot reach 3:1 on light surfaces. They always carry text or an icon that does, and the theme's `report` lists the exception. The core tests check every guarantee on the seven presets and on 500 random colours.

The guarantees cover generated values. If you override a colour, check its contrast yourself.

## Interaction

- Every control works with a keyboard, and focus is always visible when the keyboard is in use: a control's own edge lights in the focus colour, drawn inside its shape, and a focused field is lit as a whole, its shadow shortened, its floor brighter and its rim lit all round. Nothing appears after a click.
- Text never dims to show a state. Hover and press deepen a control's shadow instead.
- Pressing a button never moves it: a field's error waits until the press completes before appearing or disappearing.
- Dialogs trap focus, can be closed with Escape, and return focus to what opened them.
- Overlays render inside their provider, so they keep its language and text direction.
- With reduced motion, transitions stop and the spinner and indeterminate progress stand still. Their labels still announce them.
- In forced colours mode, surfaces and controls are drawn with system colours and visible boundaries, and selected states use `Highlight`.

## What is tested

- **Every story** in the Storybook laboratory runs its interaction test and an axe scan of the whole page, overlays included, in Chromium.
- **The browser suite** runs in Chromium, Firefox and WebKit. It scans every preset with a list open, and checks the form flow with a real pointer, keyboard use of every collection, right-to-left keyboard handling in nested providers, focus containment and restoration in dialogs, overlays escaping scrolling containers, shadows deepening on hover and press, mobile layouts, reduced motion, and forced colours (not in WebKit, which cannot emulate it).

Automated checks do not replace people. Before a stable release, test by hand:

- VoiceOver with Safari, and NVDA with Firefox or Chrome: names, descriptions, validation messages, selection, dialogs and toasts are announced.
- The keyboard alone: focus order, Shift+Tab, arrow keys, Home and End, Escape.
- Zoom at 200% and 400%: content reflows and nothing is clipped.
- Real right-to-left content, touch on small screens, and the operating system's high-contrast and reduced-motion settings.

## Your part

- Label everything: give fields a `label` (or an `aria-label`), and give `IconButton` an `aria-label`.
- Give tables a `TableCaption` and header cells, and choose heading levels for the outline, not for size.
- Use `Alert live="polite"` or `live="assertive"` for messages that appear after the page loads. Leave it unset for messages present on load.
- Keep errors that need attention in the page. Toasts disappear, so use them for confirmations.
- Name spinners and progress bars when "Loading" is not enough.

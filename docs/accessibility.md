# Accessibility verification

Carved uses native markup where possible and React Aria for stateful interactions. This provides a behavioral foundation; applications still own sensible labels, content, validation, focus order and contrast after token overrides.

## Automated coverage

Stories exercise Enter/Space, arrow keys, selection, controlled values, DOM refs, required fields, form submission and reset, Escape, descriptions, initial focus and restoration, toast dismissal and async failures. Storybook's axe addon is configured to fail tests on violations in the mounted component and its overlay containers. React Aria's global live announcer retains references briefly after controls unmount; its transient content is outside this story scope. Validate pending-action announcements manually, including after closing a dialog. The additional Playwright suite audits all generated themes, modal content and form states in Chromium, Firefox and WebKit, then checks RTL keyboard behavior, focus outlines, portal theme/depth updates, forced colors and reduced motion.

Generated theme tests require at least 4.5:1 text/description contrast and 3:1 border contrast against each of the six surfaces. Accent/danger foregrounds are tested against their backgrounds. This does not certify every arbitrary layout or custom CSS override. Disabled controls are intentionally subdued; their labels do not need normal enabled-control contrast.

## Manual release checklist

These require a human assistive-technology pass and are not substituted by axe or screenshots:

- VoiceOver with Safari and NVDA with Firefox/Chrome: announce names, descriptions, validation, radio selection, dialog opening/closing and queued notifications.
- Keyboard only: meaningful focus order, Shift+Tab, Enter/Space, arrows, Home/End, Escape, modal containment and restoration. Check submenu behavior if a consuming application adds it.
- Zoom at 200% and 400%: responsive reflow, readable content, usable controls, no clipped focused elements or dialog actions.
- OS high-contrast/forced-colors and reduced-motion settings: selected controls and keyboard outlines remain discernible; loading meaning persists without animation.
- Touch at small widths and RTL with real localized text: targets are usable and logical spacing/placement is correct.

Give IconButton a non-empty `aria-label`. Compose every input with a Label or an explicit accessible name. DialogTitle and DialogDescription connect the overlay's name and description; explicit ARIA association props remain supported. Use MenuSeparator inside collection menus. Provide a TableCaption and appropriate row/column headers for native tables. Spinner/Progress require meaningful labels. Skeleton is decorative; announce loading on its containing status region.

Keep critical errors visible in the page. Toast adapts a currently experimental upstream API; an application's most important information should not depend on a timed notification.

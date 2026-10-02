# Getting started

Carved needs React 19 and a bundler that understands ES modules and CSS imports: Vite, Next.js, Parcel, Rsbuild and friends all do.

## Install

```sh
pnpm add @plurid/carved-ui-react@next
```

The React package depends on `@plurid/carved-ui-core`, which holds the tokens and the theme engine. Install it directly only if you want `createTheme` in your own code.

## Import the stylesheet

Import it once, at the root of your application.

```tsx
import '@plurid/carved-ui-react/styles.css';
```

It contains the tokens, the seven preset themes, the material and every component, in cascade layers (`carved.tokens`, `carved.material`, `carved.components`). Any CSS you write outside a layer wins over all of it, without `!important`.

## Add a provider

`CarvedProvider` sets the theme for everything inside it, including popovers and dialogs.

```tsx
import { CarvedProvider, Button } from '@plurid/carved-ui-react';

export function App() {
  return (
    <CarvedProvider theme="ponton">
      <Button onPress={() => console.log('Saved')}>Save changes</Button>
    </CarvedProvider>
  );
}
```

The presets are `night`, `dusk`, `dawn`, `light`, `ponton`, `jaune` and `furor`. Components also work without a provider, in the default `ponton` theme.

## Build with composed components

Most components come ready to use: give them a label and options and they lay out their own parts.

```tsx
import { Select, SelectItem, TextField } from '@plurid/carved-ui-react';

<TextField label="Email" type="email" isRequired description="We send receipts here." />

<Select label="Region" placeholder="Choose a region">
  <SelectItem id="fra">Frankfurt</SelectItem>
  <SelectItem id="iad">Virginia</SelectItem>
</Select>
```

When a design needs a different arrangement, use the root and the parts instead: `TextFieldRoot` with `Label`, `Input`, `Description` and `FieldError`; `SelectRoot` with a trigger, `SelectValue`, `Popover` and `ListBox`; and so on. The parts are styled on their own, so any arrangement looks right.

## Go deeper with surfaces

A `Surface` is a recess one level deeper than whatever contains it. You rarely need to set the depth yourself.

```tsx
import { Card, CardHeader, CardTitle, Surface } from '@plurid/carved-ui-react';

<Card>
  <CardHeader>
    <CardTitle>Deploys</CardTitle>
  </CardHeader>
  <Surface>Nested one level deeper than the card</Surface>
</Card>;
```

Depth stops at five. `useDepth()` tells a component how deep it sits.

## Make your own theme

Give `createTheme` any opaque CSS colour. It builds six depths, text for each, and four inlays, and checks their contrast.

```tsx
import { createTheme } from '@plurid/carved-ui-core';

const forest = createTheme({ color: '#284c42', shadowAngle: 120 });

<CarvedProvider theme={forest}>…</CarvedProvider>;
```

Generated themes are applied as inline custom properties. To ship one as CSS instead, write it out with `themeToCss(theme, '.forest')` and put `data-carved-theme` and the class on the element it should theme.

Providers can nest, so part of a page can wear a different theme. Overlays opened inside a provider keep its theme.

## Override a token

Every value is a `--carved-*` custom property, so you can override any of them on a provider or any element inside it.

```css
.checkout {
  --carved-radius-control: 4px;
  --carved-accent: #0d6b4f;
  --carved-on-accent: #ffffff;
}
```

Popovers and dialogs render beside their provider, so set overrides that should reach them on the provider itself: through its `style`, or through a class on your application's outermost provider. When you override a colour, check its contrast yourself: the guarantees cover generated values only.

## Locale and direction

Give a provider a `locale` to set the language, number and date formatting, and text direction for everything inside it. Nested providers inherit it.

```tsx
<CarvedProvider locale="ar-EG">…</CarvedProvider>
```

Without a `locale`, Carved leaves `dir` and `lang` to your page.

## Dates and colours

Date fields, pickers and calendars work with dates from `@internationalized/date`, which keep the calendar system and time zone that a plain `Date` loses. Install it beside Carved to create and read them:

```sh
pnpm add @internationalized/date
```

```tsx
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';

<DatePicker label="Launch date" defaultValue={parseDate('2026-03-10')} />;
<Calendar aria-label="Delivery day" minValue={today(getLocalTimeZone())} />;
```

Colour components take a CSS colour string or a `Color` from `parseColor`, which Carved exports.

## Server rendering

Static content (`Heading`, `Separator`, `Badge`, `Alert`, `Skeleton`, `Table` and the card parts) renders in React Server Components. Interactive components are client components; import them anywhere and your framework will hydrate them. In the Next.js App Router, import the stylesheet in your root layout.

```tsx
// app/layout.tsx
import '@plurid/carved-ui-react/styles.css';
```

# syle.studio — Virtual Fitting Room

A 2D virtual fitting room: every garment in the collection, seen from all four
sides. One route — a welcome curtain lifts to reveal the room.

```bash
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint
pnpm placeholders # regenerate the placeholder cutouts (see below)
```

## How it is put together

```
src/
  app/page.tsx                    renders <StudioExperience/>
  components/
    StudioExperience.tsx          owns the curtain: welcome ⇄ room
    welcome/                      hero, social links, teaser strip
    fitting-room/
      FittingRoom.tsx             owns garment + view state
      GarmentStage.tsx            ★ the four-view viewport
      ViewSwitcher.tsx            front / back / left / right
      GarmentRail.tsx             pick a garment
      GarmentDetails.tsx          name, colourway, sizes, materials
      ViewPreloader.tsx           warms neighbouring garments when idle
  data/garments.ts                the catalog
  data/studio.ts                  brand name, tagline, social links
  lib/views.ts                    rotation order and helpers
  lib/hooks/                      view state, keyboard, drag-to-turn
public/garments/<slug>/           front.png back.png left.png right.png
```

## Adding a garment

1. Drop four **transparent-background cutouts** into
   `public/garments/<slug>/` named exactly `front.png`, `back.png`,
   `left.png`, `right.png`.
2. Add an entry to `src/data/garments.ts`. `viewsFor(slug, name)` builds the
   four image records from that convention, so you never type the paths.

`views` is typed as `Record<ViewKey, GarmentImage>` — a garment missing any of
the four views **will not compile**. That is deliberate: the four-view promise
is enforced by the type system, not by discipline.

Shoot all four views at the same distance and framing so garments don't jump
when you rotate. The stage bottom-aligns each cutout over a contact shadow.

## Placeholder cutouts

`pnpm placeholders` renders the 24 stand-in PNGs now in `public/garments/`.
They exist only so the room works before the photography lands. Replace them
folder by folder — no code changes needed — then delete
`scripts/generate-placeholders.mjs` and the `sharp` devDependency.

## Interaction contract

| Input | Action |
| ----- | ------ |
| Click front / back / left / right | jump to that view |
| `←` `→` | turn through the views, wrapping |
| `↑` `↓` | previous / next garment |
| `1`–`4` | jump straight to a view |
| Drag or swipe horizontally | turn the garment |

All four views of the active garment are mounted at once and only opacity and
transform animate, so turning never reflows the page and never flashes. The
current garment is mirrored into `?g=<slug>`, so any look is shareable; opening
such a link lands directly in the room.

## Brand and social links

`src/data/studio.ts` holds the studio name, tagline, intro copy and the social
links rendered on both the welcome page and the room footer. Entries marked
`CONFIRM` are placeholders.

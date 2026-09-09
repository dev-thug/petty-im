# Landing page spacing

The landing keeps its existing midnight and violet palette and Pretendard typography.
Spacing roles live on `.landing-page` in `app/landing.css` and apply to all locales.

| Role | Responsive value | Usage |
| --- | --- | --- |
| `--landing-section-gap` | 48–80px | Hero to features, features to characters, characters to download |
| `--landing-heading-gap` | 24–36px | Section heading group to content |
| `--landing-grid-gap` | 16–24px | Desktop card grids and feature grid |
| `--landing-card-inset` | 16–24px | Feature card padding |

Heading descriptions have 12px separation and 1.7 line height. Feature cards use minimum heights and grow with localized copy. Feature grids use four columns above 900px, two up to 900px, and one up to 390px. Character grids keep their compact responsive arrangement. Avoid adding breakpoint overrides that compress section spacing; adjust the shared roles instead.

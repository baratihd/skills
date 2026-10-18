# Material documentation design system

Use the existing project when present; otherwise copy `site/` as the standalone MkDocs project. The scaffold uses Material 9.7.7, pinned MkDocs/pymdown, a Makefile, no Google Fonts, native palette/search/copy/navigation, `docs/stylesheets/theme.css`, page-scoped `rtl.css` and `hooks.py`. Keep the existing project's `docs_dir` and navigation; never overwrite real content with scaffold placeholders.

## Appearance and layout

Native palette order: System / Light / Dark. System is first (`media: "(prefers-color-scheme)"`); next entries supply default/slate and exact light/dark media queries. Material owns persistence and live media handling. Labels describe current mode and next choice. No custom palette JavaScript. A small local fonts.js implements the separately requested font preferences. The OS-dark CSS fallback handles the first visit before palette initialization; synchronize those variables with slate when colors change. Test saved/manual modes as well as default mode.

Use calm surfaces and the `--docs-*` color tokens; light #F8FAFC/#FFFFFF/#1E293B and dark #0B1220/#111C2E/#E2E8F0. Semantic tokens must retain readable contrast on background, surface and code panels. Desktop navigation is left, ToC right; content remains RTL or LTR according to destination. Do not globally reverse English pages. Code/path/payload literals use LTR isolation. Preserve Material mobile drawer, search, breadcrumbs and previous/next footer.

## Fonts and components

Keep `extra.documentation_fonts` in mkdocs.yml as the option/default authority for Persian and English independently. The native details/select header control is rendered through `overrides/main.html` (inherits Material base) and `partials/font-settings.html`, then inserted into the existing header by `docs/javascripts/fonts.js`. Do not fork/copy Material's header. Readers can select Persian default/Vazirmatn, Amiri or B Nazanin, and English default/Inter or Times New Roman. Keep code on its separate mono stack. Persist only allowlisted option IDs per site root in localStorage; apply them from the early local script before content paint. Invalid/removed preferences fall back; blocked storage leaves current-page selection usable and displays a warning. Support keyboard, Escape, reset and mobile bounds. Keep no-JS CSS defaults synchronized with configured defaults.

Vazirmatn variable, Inter variable and Amiri Regular/Bold are now self-hosted with OFL files in the scaffold. B Nazanin and Times New Roman remain local-only pending a web redistribution grant; do not claim they are bundled or loaded on devices without them. B Nazanin accepts the BNazanin alias; Times New Roman falls back to Times/Liberation Serif/serif. Obtain authorized licensed font files before self-hosting. Test choice independence, computed family, reload/navigation persistence, unchanged code font, reset, corrupt IDs/JSON, denied storage and keyboard/mobile behavior. See site/THEME.md.

Prefer self-hosted licensed Vazirmatn (Persian), Inter (English), JetBrains Mono (code), minimal weights and `font-display: swap`. The scaffold includes JetBrains Mono Regular, Vazirmatn variable, Inter variable, Amiri Regular/Bold and each family’s OFL; font sources and hashes belong in the project font-assets manifest. Add missing WOFF2 + license only from authorized sources, without introducing external calls when prohibited. Do not copy proprietary application fonts without permission/licensing evidence.

Use normal Markdown tables, code, tabs, tasks and admonitions. Reusable admonition classes: verified, inferred, missing, deprecated, breaking. Always supply a visible language-correct title/status; color alone must not convey confidence. Full authoring recipes and token notes are in `site/THEME.md`. Keep no-JS content readable and respect reduced motion. Avoid custom components where native Material works.

Mermaid container/direction styling exists; no renderer is bundled and no CDN-based renderer is enabled. Before enabling diagrams, obtain an authorized local licensed renderer, configure superfences, and render/check theme changes and both languages. Until then, explicitly report Mermaid unverified; never claim diagram testing merely from CSS.

## Validation and portability

Use `make build` / `make check` for strict builds. Scaffold check is a strict build; a repository may have additional evidence checks. `make check-theme` uses Node 22+ and an already installed Chrome (override `CHROME`), no npm downloads, local loopback only, a fresh disposable profile, blocked external requests and screenshots in ignored `.automation/`. The browser script accepts paths to existing representative Persian and English pages via `THEME_FA_PAGE` and `THEME_EN_PAGE`; scaffold defaults are `/product/` and `/technical/`. `THEME_COMPONENTS_PAGE` optionally checks a temporary component fixture (never invent business facts just for a visual test).

Inspect screenshots in addition to running checks. Check reading direction, 3-column layout, mobile/tablet overflow, palette keyboard, labels, focus, search, code/copy, local fonts, reduced motion and unexpected external/asset errors. Token contrast checks are not a complete WCAG, screen-reader, syntax-color, performance or CLS audit. Document omissions precisely.

Keep the skill scaffold CSS/font assets/check script and current project equivalent files synchronized when the design contract changes. Update only authorized skill and documentation paths; never modify application code for a theme.


## Font application regression gates

Configure each option's `font_names` with only its real requested family/aliases, excluding fallback names. Probe declared FontFace loading or a local FontFace source; show a per-language missing-font message instead of treating CSS family names as proof. Ignore stale checks after selection changes. Scope Material’s `--md-text-font-family` inside both page language wrappers so explicit aside/input font rules follow the page; keep code independent and English ToC on its English stack.

Browser checks must include actual glyph fonts via CDP CSS.getPlatformFontsForNode, self-hosted Amiri/Inter/Vazirmatn, English child elements, and a deterministic absent-font fixture. Do not accept getComputedStyle(...).fontFamily alone as evidence that the requested font rendered. A downloaded desktop font or original installer is not automatically a web redistribution grant. Unverified/restricted downloads may be staged outside published content with provenance; do not quietly expose them as web assets. Runtime font requests stay local even if the user separately authorized initial downloads.

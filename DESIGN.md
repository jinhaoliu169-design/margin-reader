---
name: 页边 MARGIN
description: 以纸页批注本为视觉世界的英语小说精读工作台
colors:
  canvas: "#e9e1d4"
  paper: "#f7f1e7"
  paper-bright: "#fffbf3"
  paper-deep: "#efe6d7"
  ink: "#1d211e"
  ink-soft: "#3d433e"
  muted: "#625f57"
  faint: "#6a645b"
  line: "#d8cebd"
  line-strong: "#bdb19d"
  moss: "#405b4b"
  moss-dark: "#2e463a"
  highlighter: "#f2ca54"
  highlighter-soft: "#f7e4a3"
  clay: "#a34835"
  blue: "#476a84"
  pink: "#bc6b76"
typography:
  display:
    fontFamily: "Newsreader, Songti SC, STSong, SimSun, serif"
    fontSize: "clamp(3.5rem, 6.3vw, 5.75rem)"
    fontWeight: 430
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  reading:
    fontFamily: "Source Serif, Georgia, Songti SC, STSong, serif"
    fontSize: "19.5px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "11px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0.03em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "13px"
  xl: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
  2xl: "54px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-bright}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "44px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.moss-dark}"
    textColor: "{colors.paper-bright}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "44px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "44px"
    typography: "{typography.label}"
  highlight-action:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-bright}"
    rounded: "{rounded.md}"
    padding: "0 9px"
    height: "34px"
    typography: "{typography.label}"
  input-search:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 11px"
    height: "38px"
    typography: "{typography.body}"
  dialog-paper:
    backgroundColor: "{colors.paper-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "34px"
    typography: "{typography.body}"
  dictionary-panel:
    backgroundColor: "{colors.paper-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0"
    typography: "{typography.body}"
---

# Design System: 页边 MARGIN

## Overview

**Creative North Star: "The Annotated Folio"**

The interface behaves like a working reader's folio: warm paper, precise rules, a generous reading measure, and annotations that feel physically placed on the page. The product shell is modern and calm, borrowing the clear top navigation and grouped surfaces of a polished study app, while the reading area commits to a book-page scale and rhythm.

The visual hierarchy always follows the reading task. The library invites browsing without turning every book into a dashboard tile; the reader gives the text the largest quiet field; the dictionary behaves like a margin slip that appears only when requested. Moss is the working accent, highlighter yellow is reserved for actual annotation and selection, and clay marks source or editorial emphasis.

**Key Characteristics:**

- Warm paper neutrals with ink-black type and a single highlighter accent.
- Editorial serif display and reading faces paired with a compact sans UI face.
- Flat, rule-driven surfaces with elevation used only for floating or overlaid work.
- A single signature move: selection becomes a visible paper mark and opens a dictionary margin.
- Dense metadata in the library and dictionary, generous measure in the reader.

## Colors

The palette is built from book paper, graphite ink, moss cloth, and a physical highlighter. It is intentionally warm because the primary use scene is long-form reading; the cream family is a material commitment rather than a generic background.

### Primary
- **Reading Moss** (#405b4b): primary active state, navigation selection, progress, and confirmation. It is the calm working color of the product.
- **Deep Moss** (#2e463a): hover and pressed state for primary actions.

### Secondary
- **Highlighter Yellow** (#f2ca54): reserved for selected text, prototype annotation, and active marking tools.
- **Soft Highlighter** (#f7e4a3): low-priority explanatory field or empty-state mark behind a dictionary invitation.
- **Editorial Clay** (#a34835): source labels, dictionary accents, and small editorial emphasis.

### Tertiary
- **Notebook Blue** (#476a84): secondary annotation color only.
- **Notebook Pink** (#bc6b76): secondary annotation color only.

### Neutral
- **Ink Black** (#1d211e): primary text, dark buttons, and the floating selection toolbar.
- **Soft Ink** (#3d433e): reading body and secondary prose.
- **Muted Graphite** (#625f57): metadata, descriptions, and inactive controls.
- **Faint Graphite** (#6a645b): least prominent readable text; still above the AA floor on paper.
- **Book Paper** (#f7f1e7): main application ground.
- **Bright Paper** (#fffbf3): reading sheet and primary content surfaces.
- **Deckle Paper** (#efe6d7): grouped panels, search fields, and low-emphasis surfaces.
- **Shelf Shadow** (#e9e1d4): outer canvas behind the application shell.
- **Rule Line** (#d8cebd): dividers and quiet borders.
- **Strong Rule** (#bdb19d): dashed drop zones and structural borders.

**The Highlighter Scarcity Rule.** Highlighter yellow is earned by a selection, a marked word, or the marking control. It is never page decoration.

## Typography

**Display Font:** Newsreader (with Songti/SimSun fallback)
**Reading Font:** Source Serif (with Georgia and Songti fallback)
**Body and Label Font:** Manrope (with PingFang/YaHei fallback)

**Character:** The serif faces carry literary voice and long-form comfort; Manrope keeps controls, metadata, and dictionary structure precise. The contrast is editorial rather than ornamental.

### Hierarchy
- **Display** (430, clamp 3.5–5.75rem, 0.94 line-height): library, import, and wordbook statements. Maximum width stays near 8em.
- **Headline** (470–520, 32–58px, 0.98–1.08 line-height): reader title, section titles, and dialog titles.
- **Reading** (400, 19.5px default with user adjustment, 1.8 line-height): the reading sheet, held to a 65–75ch measure.
- **Body** (400, 13–15px, 1.7–1.8 line-height): interface prose and explanations.
- **Label** (650–750, 11–12px, compact tracking): navigation, buttons, metadata, and tabs. Uppercase micro-labels may use wider tracking only when short and non-prose.

**The One Reading Face Rule.** Reading text uses Source Serif at the user's selected size; display lettering does not enter the reading column.

## Layout

The application uses a fixed 76px top header with brand at left, a centered four-item capsule navigation, and search/import utilities at right. Main content is centered to a maximum 1370px with a 30px outer gutter. The library begins with a rounded 18px paper panel containing the reading proposition and a live reading proof, followed by a four-cell overview strip and the dense six-column book shelf.

The reader is a three-column work area: a 214px book rail, a 690px reading sheet, and a 320–370px dictionary margin. At 1080px the book rail drops away; below 860px the dictionary becomes a bottom panel and the main navigation moves to a fixed bottom bar. Book titles must remain readable at every breakpoint; covers collapse to a two-column shelf on phones.

Spacing follows a 4/8/16/24/36/54px rhythm. Tight groups sit inside a single surface; large separations divide jobs, never individual cards.

## Elevation & Depth

The shell is flat and tonal. Raised surfaces are limited to the reading sheet, the dictionary margin, floating selection toolbar, side drawer, and paste dialog. Shadows should feel like a broad ambient lift from paper, not a border substitute.

### Shadow Vocabulary
- **Reading sheet** (`0 22px 65px rgba(61, 47, 25, 0.1)`): the center page against the canvas at rest.
- **Working margin** (`0 18px 45px rgba(57, 43, 23, 0.09)`): dictionary panel and other persistent work surfaces.
- **Floating action** (`0 14px 34px rgba(20, 24, 21, 0.26)`): the selected-text toolbar.
- **Protected dialog** (`0 18px 44px rgba(34, 28, 19, 0.2)`): the paste dialog and other protected-focus overlays.

**The Paper At Rest Rule.** Static library cards and grouped panels are flat. Elevation communicates either a physical sheet or a temporary overlay.

## Shapes

Borders are thin, warm-gray rules; corners are gently curved where the surface is an interface panel. The reader sheet stays nearly square (3px) to preserve folio character. Buttons use 8px corners; pills are reserved for filter chips and circular tool controls. No decorative clip paths, geometric masks, or ornamental corner systems.

## Components

### Buttons
- **Shape:** 8px rounded rectangle; 44px primary height and 34–38px compact utility height.
- **Primary:** Ink ground with bright-paper label; hover shifts to deep moss and lifts 1px.
- **Secondary:** Transparent or deckle-paper ground with a 1px warm rule; hover strengthens the border.
- **Quiet:** Text and icon only; used for utility actions such as export and clear.

### Chips
- **Style:** 99px radius, 11px label, 6px vertical and 11px horizontal padding.
- **State:** Inactive is muted text on transparent paper; selected is bright paper on ink.

### Cards / Containers
- **Corner Style:** 13px for grouped data panels; 18px for the hero surface; 2–3px for reading paper.
- **Background:** Bright paper for primary content, deckle paper for grouped secondary content.
- **Shadow Strategy:** Only persistent work surfaces and the reading sheet receive elevation.
- **Border:** 1px rule line, or a 1.5px dashed rule for drop targets.
- **Internal Padding:** 16–34px depending on density; reading sheet 45–67px at desktop.

### Inputs / Fields
- **Style:** 38–40px high, 8px radius, deckle-paper ground, 1px rule.
- **Focus:** Border shifts to strong rule or moss; background becomes bright paper.
- **Placeholder:** Faint graphite at accessible contrast, never pale decorative gray.

### Navigation
- **Style:** Centered capsule on deckle paper; 33px high links with active bright-paper fill and a quiet border.
- **Mobile:** Fixed bottom navigation with 11px labels and 18px icons; dictionary becomes a bottom panel above the bar.

### Selection Toolbar
- **Style:** Ink-black floating capsule with a highlighter icon, four annotation color dots, and a short state line.
- **Behavior:** Appears only for a non-empty selection inside one reader paragraph; marking adds the persistent mark and opens the dictionary margin.

## Do's and Don'ts

### Do:
- **Do** reserve highlighter yellow for actual highlight marks, active marking UI, and one editorial accent per surface.
- **Do** keep reading measure between 65 and 75 characters and preserve the user's adjustable reading size.
- **Do** use rules and tonal paper shifts before adding shadows.
- **Do** keep book covers and dictionary data real; use typographic fallback covers only when the source image is missing.
- **Do** show an honest error and recovery path when the dictionary, OCR model, or remote full text is unavailable.

### Don't:
- **Don't** turn the library into a wall of identical icon cards or a hero-metric dashboard.
- **Don't** use gradients, glass decoration, or colored halos in the reading area.
- **Don't** use clay or highlighter yellow as large surfaces behind body text.
- **Don't** place display lettering inside dictionary definitions or reading paragraphs.
- **Don't** hide state behind color alone; pair every annotation color with a text label, selected state, or accessible name.

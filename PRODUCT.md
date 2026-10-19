# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: plain HTML/CSS/JavaScript front end with a small Python standard-library server for dictionary proxying, book metadata, and on-demand public-domain text retrieval. This keeps the site runnable without a package install while preserving a clean API boundary for later deployment.

## Users

Chinese-speaking English learners who read novels and imported articles. Their core situation is reading long-form English in a browser while needing fast, contextual word lookup without leaving the page. They may also capture article passages as screenshots and want that text to become readable, highlightable content.

## Product Purpose

Provide a focused English reading workspace with a 620-title public-domain English novel catalog, a distraction-free reader, persistent text highlights, Chinese dictionary results, and screenshot-to-text import. Success means a learner can open any book in the main shelf and read it free, or import a passage, select an unfamiliar word, confirm a highlight, and understand the word without breaking flow.

## Positioning

The product combines a broad English-novel discovery catalog with an annotation-first reader and one-gesture screenshot import. The distinctive mechanism is that highlighting and dictionary lookup are one action, while article text from screenshots enters the same annotation and dictionary workflow as a book.

## Operating Context

Users read on desktop and laptop browsers, frequently with a dictionary panel open beside the text. They may study in short sessions, switch between books and imported passages, and expect reading position, highlights, saved words, and imported articles to survive refreshes. Dictionary content is fetched from Youdao's public dictionary response and should degrade gracefully when the network or source is unavailable. OCR runs in the browser after an image is dropped, pasted, or selected.

## Capabilities and Constraints

- The main library contains 620 public-domain English novels, all with direct free full-text reading, covers, English and Chinese titles, author, genre signals, and search/filter controls.
- Copyrighted works are not bundled. Users may import texts or passages they legally own into the same reader.
- Users can select text in the reader, confirm a highlight, and view a rich dictionary entry for the selected word or phrase.
- Dictionary results include pronunciation, concise bilingual meanings, example sentences, phrases, and source attribution where available.
- Definitions can be proxied from Youdao and cached locally; a clear offline/error state and a small built-in fallback dictionary are required.
- Images can be dragged onto the site, pasted, or picked from disk; recognized English text is cleaned and opened in the reader.
- Imported articles persist in a local backend store with editable English title, Chinese note, source, and source-book association; browser storage remains a fallback.
- Saved articles can receive additional OCR or pasted text through an append workflow without replacing existing content.
- The import flow can append to an existing article with the same editable source.
- A dedicated “我的” page surfaces reading progress, reading-page counts, highlights, saved words, imported articles, and a recycle bin with restore/permanent-delete actions.
- Every novel and imported article supports paragraph-level Chinese translations that are collapsed by default and can be expanded individually or by page.
- Novel catalog entries display English and Chinese titles and can be searched by either.
- Highlights, saved words, and reading position persist in browser storage.
- The first release is a local web application; accounts, cloud sync, payments, social features, and DRM ebook parsing are out of scope.

## Brand Commitments

The interface uses Chinese product copy with English reading content. The user explicitly referenced a floating Highlight action and a dense, editorial dictionary panel as behaviors to preserve. No existing brand name, logo, or visual identity was supplied.

## Evidence on Hand

- A reference screenshot showing a `Highlight` icon-and-label action.
- A reference screenshot showing a Youdao dictionary result for “edible”, including phonetics, Chinese explanation, part-of-speech meanings, exam tags, plural form, example content, and related phrases.
- Public catalog and cover metadata are available through Open Library.
- Public-domain reading texts are available through Project Gutenberg.
- Youdao's dictionary response endpoint is reachable for English headwords.

## Product Principles

1. Reading stays primary; tools appear at the moment of need and then recede.
2. One deliberate gesture should connect selection, annotation, and understanding.
3. The library is broad, but reading access must respect copyright and clearly distinguish full text from discoverable catalog entries.
4. Imported material becomes equal to built-in material: if it can be read, it can be highlighted and looked up.
5. Network-dependent features must show honest, recoverable states rather than fail silently.

## Accessibility & Inclusion

Keyboard users must be able to search the catalog, open a book, select and highlight text, navigate dictionary tabs, dismiss overlays, and import files. Controls need visible focus states, dictionary text and UI labels must meet WCAG AA contrast, reader typography must be adjustable, and motion must respect reduced-motion preferences.

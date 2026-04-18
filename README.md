# marked-obsidian

[![npm version](https://img.shields.io/npm/v/marked-obsidian.svg)](https://www.npmjs.com/package/marked-obsidian)
[![CI](https://github.com/wvanderp/marked-obsidian/actions/workflows/ci.yml/badge.svg)](https://github.com/wvanderp/marked-obsidian/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/codecov/c/github/wvanderp/marked-obsidian)](https://codecov.io/gh/wvanderp/marked-obsidian)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [marked](https://marked.js.org/) plugin that adds support for [Obsidian](https://obsidian.md/)-specific markdown syntax.

## Setup

Install the package:

```bash
npm install marked-obsidian
```

Register the plugin with marked:

```js
import { marked } from 'marked';
import MarkedObsidianPlugin from 'marked-obsidian';

marked.use(MarkedObsidianPlugin());

const html = marked.parse('==highlighted==');
```

## Obsidian Markdown Features

The following Obsidian-specific syntax extensions are supported.

### Internal Links (Wikilinks)

Links to other notes using double-bracket syntax.

```md
[[Three laws of motion]]
[[Three laws of motion|Newton's Laws]]
[[Three laws of motion#first-law|the first law]]
[[#the-end]]
```

> [Obsidian docs — Internal links](https://help.obsidian.md/Linking+notes+and+files/Internal+links)

### Embedded Files

Embed other notes, images, or files inline.

```md
![[my-image.png]]
![[my-note]]
```

> [Obsidian docs — Embed files](https://help.obsidian.md/Linking+notes+and+files/Embed+files)

### Callouts

Styled admonition blocks for notes, warnings, tips, etc.

```md
> [!info]
> Here's a callout block.
> It supports **Markdown**, [[wikilinks]], and more.

> [!warning] Heads up
> Something to be careful about.
```

> [Obsidian docs — Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts)

### Highlights

```md
==highlighted text==

this is ==highlighted== in the middle of a line
```

> [Obsidian docs — Bold, italics, highlights](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Bold%2C+italics%2C+highlights)

### Strikethrough

```md
~~strikethrough~~
```

> [Obsidian docs — Strikethrough](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Bold%2C+italics%2C+highlights)

### Comments

Comments are stripped from the rendered output.

```md
%% This is an inline comment. %%

Visible text with an %%inline%% comment.

%%
This is a
multi-line block comment.
%%
```

> [Obsidian docs — Comments](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Comments)

### Block Links

Named anchors used to link to a specific block within a note.

```md
Some paragraph content. ^my-block
```

> [Obsidian docs — Link to a block in a note](https://help.obsidian.md/Linking+notes+and+files/Internal+links#Link+to+a+block+in+a+note)

## Usage

The plugin is registered once and applies to all subsequent `marked.parse()` calls. You can use the full marked API alongside the Obsidian extensions.

```js
import { marked } from 'marked';
import MarkedObsidianPlugin from 'marked-obsidian';

marked.use(MarkedObsidianPlugin());

// Internal links
marked.parse('[[My Note]]');
// → <p><a href="My Note">My Note</a></p>

// Highlights
marked.parse('==important==');
// → <p><mark>important</mark></p>

// Callouts
marked.parse('> [!warning]\n> Be careful.');
// → <div class="callout callout-warning">...</div>

// Comments (stripped from output)
marked.parse('%% this will not appear %%');
// → <p></p>
```

The plugin enables GFM (GitHub Flavored Markdown) by default, so standard features like tables and task lists also work:

```md
- [x] Done
- [ ] Not done
```

## Contributing

Contributions are welcome in several forms.

### Testing Against Your Own Markdown Files

The test suite uses paired `.md` and `.html` files located in `tests/spec/pairs/`. To test with your own Obsidian content:

1. Add a `.md` file with your input markdown to `tests/spec/pairs/`
2. Add a matching `.html` file with the expected HTML output
3. Run the tests:

```bash
npm test
```

The spec runner in `tests/spec/runPairs.spec.ts` will automatically pick up any new pairs. If your file exercises a bug or edge case that was previously unhandled, add a unit test in `tests/unit/` alongside the pair test.

### Adding New Obsidian Markdown Features

1. Create a new tokenizer/renderer extension in `src/extensions/` following the pattern of the existing extensions (e.g. `highlight.ts` or `callouts.ts`).
2. Register it in `src/index.ts` by importing and adding it to the `extensions` array.
3. Add unit tests in `tests/unit/` and a pair test in `tests/spec/pairs/`.
4. Check types and linting:

```bash
npm run lint
```

The extensions use the [marked extension API](https://marked.js.org/using_pro#extensions). Each extension exports an object with a `name`, `level` (`'block'` or `'inline'`), `start`, `tokenizer`, and `renderer`.

### Using and Advocating for the Plugin

If you use `marked-obsidian` in a project, consider:

- **Sharing your use case** by opening a Discussion on the repository — knowing how people use the plugin helps prioritise new features.
- **Writing about it** in blog posts, documentation, or community forums (Reddit, Obsidian Discord, DEV.to, etc.).
- **Integrating it** into tools, static site generators, or note-publishing workflows that process Obsidian vaults.
- **Raising issues** when you encounter Obsidian markdown that isn't handled correctly, even if you can't fix it yourself.

## License

MIT

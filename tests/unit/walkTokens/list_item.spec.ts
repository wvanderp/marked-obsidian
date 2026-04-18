import { expect, describe, it } from 'vitest';
import walkTokens from '../../../src/walkTokens';
import { marked } from 'marked';
import MarkedObsidianPlugin from '../../../src';

describe('walkTokens - list_item', () => {
    it('should change the token if its secretly a task list item', () => {
        const token = {
            type: "list_item",
            raw: "- [V] **event** is done",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] **event** is done",
            tokens: [
                {
                    type: "text",
                    raw: "[V] **event** is done",
                    text: "[V] **event** is done",
                    tokens: [
                        { type: "text", raw: "[V] ", text: "[V] " },
                        {
                            type: "strong", raw: "**event**", text: "event",
                            tokens: [
                                { type: "text", raw: "event", text: "event" }
                            ]
                        },
                        { type: "text", raw: " is done", text: " is done" }
                    ]
                }
            ]
        }


        walkTokens(token)

        expect(token).toEqual({
            type: 'list_item',
            raw: '- [V] **event** is done',
            task: true,
            checked: true,
            loose: false,
            text: '**event** is done',
            tokens: [
                {
                    type: 'checkbox',
                    raw: '[V] ',
                    checked: true,
                },
                {
                    type: 'text',
                    raw: '**event** is done',
                    text: '**event** is done',
                    tokens: [
                        {
                            type: 'strong',
                            raw: '**event**',
                            text: 'event',
                            tokens: [
                                {
                                    type: 'text',
                                    raw: 'event',
                                    text: 'event'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            raw: ' is done',
                            text: ' is done'
                        }
                    ]
                }
            ]
        })
    });

    it('should not touch the token if its not a task list item', () => {
        const token = {
            "type": "list_item",
            "raw": "- this is a normal list item",
            "task": false,
            "loose": false,
            "text": "this is a normal list item",
            "tokens": [
                {
                    "type": "text",
                    "raw": "this is a normal list item",
                    "text": "this is a normal list item"
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not touch the token if the task list item is not checked', () => {
        const token = {
            type: "list_item",
            raw: "- [ ] this is a normal list item",
            task: true,
            checked: false,
            loose: false,
            text: "this is a normal list item",
            tokens: [
                {
                    type: "text",
                    raw: "this is a normal list item",
                    text: "this is a normal list item",
                    tokens: [
                        {
                            type: "text",
                            raw: "this is a normal list item",
                            text: "this is a normal list item"
                        }
                    ]
                }
            ]
        }


        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should lex the tokens the same way', () => {
        const markdown = `- [x] Write the **press release**`;

        const tokens = marked.use(MarkedObsidianPlugin()).lexer(markdown);

        const expected = [
            {
                "type": "list",
                "raw": "- [x] Write the **press release**",
                "ordered": false,
                "start": "",
                "loose": false,
                "items": [
                    {
                        "type": "list_item",
                        "raw": "- [x] Write the **press release**",
                        "task": true,
                        "loose": false,
                        "text": "Write the **press release**",
                        "tokens": [
                            {
                                "type": "checkbox",
                                "raw": "[x] ",
                                "checked": true
                            },
                            {
                                "type": "text",
                                "raw": "Write the **press release**",
                                "text": "Write the **press release**",
                                "tokens": [
                                    {
                                        "type": "text",
                                        "raw": "Write the ",
                                        "text": "Write the ",
                                        "escaped": false
                                    },
                                    {
                                        "type": "strong",
                                        "raw": "**press release**",
                                        "text": "press release",
                                        "tokens": [
                                            {
                                                "type": "text",
                                                "raw": "press release",
                                                "text": "press release",
                                                "escaped": false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "checked": true
                    }
                ]
            }
        ];

        expect(JSON.stringify(tokens, null, 2)).toBe(JSON.stringify(expected, null, 2))
    });

    it('should work when turning into html with markup in the text', () => {
        const markdown = `- [V] **event** is done`;

        const html = marked.use(MarkedObsidianPlugin()).parse(markdown);

        expect(html).toBe('<ul>\n<li><input checked="" disabled="" type="checkbox"> <strong>event</strong> is done</li>\n</ul>\n')
    });

    it('should work when turning into html', () => {
        const markdown = `- [x] Write the **press release**`;

        const html = marked.use(MarkedObsidianPlugin()).parse(markdown);

        expect(html).toBe('<ul>\n<li><input checked="" disabled="" type="checkbox"> Write the <strong>press release</strong></li>\n</ul>\n')
    });

    it('should delete tokens array when it becomes empty after splice', () => {
        const token = {
            type: "list_item",
            raw: "- [V] done",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] done",
            tokens: [
                {
                    type: "text",
                    raw: "[V] done",
                    text: "[V] done",
                    tokens: [
                        { type: "text", raw: "[V] done", text: "[V] done" }
                    ]
                }
            ]
        }

        walkTokens(token)

        expect(token.task).toBe(true)
        expect(token.checked).toBe(true)
        expect(token.text).toBe('done')
        // The inner tokens array should be deleted since it became empty after splice
        const textToken = token.tokens[1] as any;
        expect(textToken.tokens).toBeUndefined();
    });

    it('should handle unchecked task not previously recognized by marked', () => {
        const token = {
            type: "list_item",
            raw: "- [ ] unchecked",
            task: false,
            checked: undefined,
            loose: false,
            text: "[ ] unchecked",
            tokens: [
                {
                    type: "text",
                    raw: "[ ] unchecked",
                    text: "[ ] unchecked",
                    tokens: [
                        { type: "text", raw: "[ ] unchecked", text: "[ ] unchecked" }
                    ]
                }
            ]
        }

        walkTokens(token)

        expect(token.task).toBe(true)
        expect(token.checked).toBe(false)
        expect(token.text).toBe('unchecked')
        // No checkbox unshifted since checked is false, so textTokenIndex = 0
        expect(token.tokens[0].type).toBe('text')
    });

    it.each([
        ['-', 'cancelled'],
        ['/', 'half done'],
        ['>', 'forwarded'],
        ['?', 'question'],
        ['!', 'important'],
        ['v', 'lowercase v'],
    ])('should handle Obsidian marker [%s] (%s)', (marker) => {
        const token = {
            type: "list_item",
            raw: `- [${marker}] some task`,
            task: false,
            checked: undefined,
            loose: false,
            text: `[${marker}] some task`,
            tokens: [
                {
                    type: "text",
                    raw: `[${marker}] some task`,
                    text: `[${marker}] some task`,
                    tokens: [
                        { type: "text", raw: `[${marker}] some task`, text: `[${marker}] some task` }
                    ]
                }
            ]
        }

        walkTokens(token)

        expect(token.task).toBe(true)
        expect(token.checked).toBe(true)
        expect(token.text).toBe('some task')
        expect(token.tokens[0]).toEqual({
            type: 'checkbox',
            raw: `[${marker}] `,
            checked: true,
        })
    });

    it('should not duplicate checkbox when [x] is already processed by marked', () => {
        const token = {
            type: "list_item",
            raw: "- [x] already handled",
            task: true,
            checked: true,
            loose: false,
            text: "already handled",
            tokens: [
                {
                    type: "checkbox",
                    raw: "[x] ",
                    checked: true
                },
                {
                    type: "text",
                    raw: "already handled",
                    text: "already handled",
                    tokens: [
                        { type: "text", raw: "already handled", text: "already handled" }
                    ]
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not process list items with * marker', () => {
        const token = {
            type: "list_item",
            raw: "* [V] starred task",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] starred task",
            tokens: [
                {
                    type: "text",
                    raw: "[V] starred task",
                    text: "[V] starred task",
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not process list items with + marker', () => {
        const token = {
            type: "list_item",
            raw: "+ [V] plus task",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] plus task",
            tokens: [
                {
                    type: "text",
                    raw: "[V] plus task",
                    text: "[V] plus task",
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not process ordered list items', () => {
        const token = {
            type: "list_item",
            raw: "1. [V] ordered task",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] ordered task",
            tokens: [
                {
                    type: "text",
                    raw: "[V] ordered task",
                    text: "[V] ordered task",
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not match when checkbox has no trailing space or text (e.g. "- [V]")', () => {
        const token = {
            type: "list_item",
            raw: "- [V]",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V]",
            tokens: [
                {
                    type: "text",
                    raw: "[V]",
                    text: "[V]",
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not match multiline raw where second line exists', () => {
        const token = {
            type: "list_item",
            raw: "- [V] first line\n  second line",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] first line\nsecond line",
            tokens: [
                {
                    type: "text",
                    raw: "[V] first line\nsecond line",
                    text: "[V] first line\nsecond line",
                    tokens: [
                        { type: "text", raw: "[V] first line\nsecond line", text: "[V] first line\nsecond line" }
                    ]
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should handle text token without nested tokens array', () => {
        const token = {
            type: "list_item",
            raw: "- [V] plain text",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] plain text",
            tokens: [
                {
                    type: "text",
                    raw: "[V] plain text",
                    text: "[V] plain text",
                }
            ]
        }

        walkTokens(token)

        expect(token.task).toBe(true)
        expect(token.checked).toBe(true)
        expect(token.text).toBe('plain text')
        expect(token.tokens[0]).toEqual({
            type: 'checkbox',
            raw: '[V] ',
            checked: true,
        })
        expect(token.tokens[1].text).toBe('plain text')
    });

    it('should handle token with empty tokens array', () => {
        const token = {
            type: "list_item",
            raw: "- [V] text",
            task: false,
            checked: undefined,
            loose: false,
            text: "[V] text",
            tokens: [] as any[]
        }

        // Should not throw
        walkTokens(token)

        expect(token.task).toBe(true)
        expect(token.checked).toBe(true)
        expect(token.text).toBe('text')
    });

    it('should not match multi-char brackets like [xx]', () => {
        const token = {
            type: "list_item",
            raw: "- [xx] not a checkbox",
            task: false,
            checked: undefined,
            loose: false,
            text: "[xx] not a checkbox",
            tokens: [
                {
                    type: "text",
                    raw: "[xx] not a checkbox",
                    text: "[xx] not a checkbox",
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it('should not match empty brackets []', () => {
        const token = {
            type: "list_item",
            raw: "- [] not a checkbox",
            task: false,
            checked: undefined,
            loose: false,
            text: "[] not a checkbox",
            tokens: [
                {
                    type: "text",
                    raw: "[] not a checkbox",
                    text: "[] not a checkbox",
                }
            ]
        }

        const expected = JSON.parse(JSON.stringify(token))

        walkTokens(token)

        expect(token).toEqual(expected)
    });

    it.each([
        ['-', 'cancelled'],
        ['/', 'half done'],
        ['>', 'forwarded'],
    ])('should produce correct HTML for Obsidian marker [%s] (%s)', (marker) => {
        const markdown = `- [${marker}] a task`;

        const html = marked.use(MarkedObsidianPlugin()).parse(markdown);

        expect(html).toBe('<ul>\n<li><input checked="" disabled="" type="checkbox"> a task</li>\n</ul>\n')
    });

});

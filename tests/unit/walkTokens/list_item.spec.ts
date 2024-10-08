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
                  "checked": true,
                  "loose": false,
                  "text": "Write the **press release**",
                  "tokens": [
                    {
                      "type": "text",
                      "raw": "Write the **press release**",
                      "text": "Write the **press release**",
                      "tokens": [
                        {
                          "type": "text",
                          "raw": "Write the ",
                          "text": "Write the "
                        },
                        {
                          "type": "strong",
                          "raw": "**press release**",
                          "text": "press release",
                          "tokens": [
                            {
                              "type": "text",
                              "raw": "press release",
                              "text": "press release"
                            }
                          ]
                        }
                      ]
                    }
                  ]
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


});

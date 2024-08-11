import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

const testCases: [string, object, string][] = []

testCases.push(
    [
        '__bold__',
        [
            {
                "type": "paragraph",
                "raw": "__bold__",
                "text": "__bold__",
                "tokens": [
                    {
                        "type": "strong",
                        "raw": "__bold__",
                        "text": "bold",
                        "tokens": [
                            {
                                "type": "text",
                                "raw": "bold",
                                "text": "bold"
                            }
                        ]
                    }
                ]
            }
        ],
        'bold'
    ])

testCases.push(
    [
        '[[link]]',
        [
            {
                "type": "paragraph",
                "raw": "[[link]]",
                "text": "[[link]]",
                "tokens": [
                    {
                        "type": "obsidian-link",
                        "raw": "[[link]]",
                        "text": "link",
                        "link": "link"
                    }
                ]
            }
        ],
        'link'	
    ])

testCases.push(
    [
        '![[file]]',
        [
            {
                "type": "paragraph",
                "raw": "![[file]]",
                "text": "![[file]]",
                "tokens": [
                    {
                        "type": "obsidian-embedded-file",
                        "raw": "![[file]]",
                        "text": "file"
                    }
                ]
            }
        ],
        'embedded file'
    ]
)

testCases.push(
    [
        '[[2023-01-01#^quote-of-the-day]]',
        [
            {
                "type": "paragraph",
                "raw": "[[2023-01-01#^quote-of-the-day]]",
                "text": "[[2023-01-01#^quote-of-the-day]]",
                "tokens": [
                    {
                        "type": "obsidian-link",
                        "raw": "[[2023-01-01#^quote-of-the-day]]",
                        "text": "2023-01-01#^quote-of-the-day",
                        "link": "2023-01-01",
                        "blockReference": "quote-of-the-day"
                    }
                ]
            }
        ],
        'link with block reference'	
    ]
)

testCases.push(
    [
        '![[2023-01-01#^quote-of-the-day]]',
        [
            {
                "type": "paragraph",
                "raw": "![[2023-01-01#^quote-of-the-day]]",
                "text": "![[2023-01-01#^quote-of-the-day]]",
                "tokens": [
                    {
                        "type": "obsidian-embedded-file",
                        "raw": "![[2023-01-01#^quote-of-the-day]]",
                        "text": "2023-01-01#^quote-of-the-day"
                    }
                ]
            }
        ],
        'embedded file with block reference'
    ]
)

testCases.push(
    [
        '^block',
        [
            {
                "type": "paragraph",
                "raw": "^block",
                "text": "^block",
                "tokens": [
                    {
                        "type": "obsidian-block-link",
                        "raw": "^block",
                        "text": "block"
                    }
                ]
            }
        ],
        'block link'
    ]
)

testCases.push(
    [
        '%%commented%%',
        [
            {
                "type": "paragraph",
                "raw": "%%commented%%",
                "text": "%%commented%%",
                "tokens": [
                    {
                        "type": "obsidian-comment",
                        "raw": "%%commented%%",
                        "text": "commented"
                    }
                ]
            }
        ],
        'comment'
    ]
)

testCases.push(
    [
        '~~strikethrough~~',
        [
            {
                "type": "paragraph",
                "raw": "~~strikethrough~~",
                "text": "~~strikethrough~~",
                "tokens": [
                    {
                        "type": "obsidian-strikethrough",
                        "raw": "~~strikethrough~~",
                        "text": "strikethrough",
                        "tokens": [
                            {
                                "type": "text",
                                "raw": "strikethrough",
                                "text": "strikethrough"
                            }
                        ]                        
                    }
                ]
            }
        ],
        'strikethrough'
    ]
)

testCases.push(
    [
        '==highlight==',
        [
            {
                "type": "paragraph",
                "raw": "==highlight==",
                "text": "==highlight==",
                "tokens": [
                    {
                        "type": "obsidian-highlight",
                        "raw": "==highlight==",
                        "text": "highlight"
                    }
                ]
            }
        ],
        'highlight'
    ]
)

testCases.push(
    [
        `- [ ] task`,
        [
            {
                "type": "obsidian-task-list-item",
                "raw": "- [ ] task",
                "text": "task",
                "checked": false,
                "checkMark": " ",
                "tokens": [
                    {
                        "type": "text",
                        "raw": "task",
                        "text": "task"
                    }
                ]
            }
        ],
        'incomplete task'
    ]
)

testCases.push(
    [
        `- [v] task`,
        [
            {
                "type": "obsidian-task-list-item",
                "raw": "- [v] task",
                "text": "task",
                "checked": true,
                "checkMark": "v",
                "tokens": [
                    {
                        "type": "text",
                        "raw": "task",
                        "text": "task"
                    }
                ]
            }
        ],
        'completed task'
    ]
)

// 

const calloutTest = `> [!info]  ` +
        `> Here's a callout block.  ` +
        `> It supports **Markdown**, [[Internal link|Wikilinks]], and [[Embed files|embeds]]!  ` +
        `> ![[Engelbart.jpg]]  `

testCases.push(
    [
        calloutTest,
        [
            {
                "type": "obsidian-callout",
                "raw": calloutTest,
                "text": "  > Here's a callout block.  > It supports **Markdown**, [[Internal link|Wikilinks]], and [[Embed files|embeds]]!  > ![[Engelbart.jpg]]  ",
                "calloutType": "info"
            }
        ],
        'callout'
    ]
)




for (const [input, expected, title] of testCases) {
    test(title, () => {
        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);
        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });
}

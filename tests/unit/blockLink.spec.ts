import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

describe('blockLinks', () => {
    it('should parse block links', () => {
        const input = `~~strike trough~~\n\n^quote-of-the-day`
        const expected = [
            {
                "type": "paragraph",
                "raw": "~~strike trough~~",
                "text": "~~strike trough~~",
                "tokens": [
                    {
                        "type": "obsidian-strikethrough",
                        "raw": "~~strike trough~~",
                        "text": "strike trough",
                        "tokens": [
                            {
                                "type": "text",
                                "raw": "strike trough",
                                "text": "strike trough"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "space",
                "raw": "\n\n"
            },
            {
                "type": "paragraph",
                "raw": "^quote-of-the-day",
                "text": "^quote-of-the-day",
                "tokens": [
                    {
                        "type": "obsidian-block-link",
                        "raw": "^quote-of-the-day",
                        "text": "quote-of-the-day"
                    }
                ]
            }
        ];

        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);
        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });
});

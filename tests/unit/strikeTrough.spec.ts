import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

describe('strikeTrough', () => {
    it('should return a string with a strike trough', () => {
        const input = '~~strike trough~~';
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
            }
        ];

        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);
        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });

    it('should return a string with a strike trough and all child tokens', () => {
        const input = '~~**strike trough**~~';
        const expected = [
            {
                "type": "paragraph",
                "raw": "~~**strike trough**~~",
                "text": "~~**strike trough**~~",
                "tokens": [
                    {
                        "type": "obsidian-strikethrough",
                        "raw": "~~**strike trough**~~",
                        "text": "**strike trough**",
                        "tokens": [
                            {
                                "type": "strong",
                                "raw": "**strike trough**",
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

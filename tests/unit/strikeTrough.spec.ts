import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';
import strikethroughExt from '../../src/extensions/strikethrough';

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
                                "text": "strike trough",
                                "escaped": false
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
                                        "text": "strike trough",
                                        "escaped": false
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

    it('should render with no tokens as empty s tag', () => {
        const renderer = strikethroughExt.renderer!;
        const result = renderer.call(
            { parser: { parseInline: (t: any) => t } } as any,
            { tokens: undefined } as any
        );
        expect(result).toBe('<s></s>');
    });
});

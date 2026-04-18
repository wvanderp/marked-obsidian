import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';
import highlightExt from '../../src/extensions/highlight';

describe('highlight', () => {
    it('should return highlighted text', () => {
        const input = '==highlighted text==';
        const expected = [
            {
                type: 'paragraph',
                raw: '==highlighted text==',
                text: '==highlighted text==',
                tokens: [
                    {
                        "type": "obsidian-highlight",
                        "raw": "==highlighted text==",
                        "text": "highlighted text",
                        "tokens": [
                            {
                                "type": "text",
                                "raw": "highlighted text",
                                "text": "highlighted text",
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

    it('should render with no tokens as empty mark', () => {
        const renderer = highlightExt.renderer!;
        const result = renderer.call(
            { parser: { parseInline: (t: any) => t } } as any,
            { tokens: undefined } as any
        );
        expect(result).toBe('<mark></mark>');
    });
});

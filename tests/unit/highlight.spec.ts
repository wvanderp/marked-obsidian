import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';
import highlightExt from '../../src/extensions/highlight';
import { ObsidianHighlightToken } from '../../src/extensions/highlight';
import { RendererThis } from 'marked';

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
        const context = {
            parser: {
                parseInline: (tokens: unknown) => String(tokens)
            }
        };
        const token: ObsidianHighlightToken = {
            type: 'obsidian-highlight',
            raw: '===='
        };
        const result = renderer.call(
            context as unknown as RendererThis<string, string>,
            token
        );
        expect(result).toBe('<mark></mark>');
    });
});

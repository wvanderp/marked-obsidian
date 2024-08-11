import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

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
                                "text": "highlighted text"
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

import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

describe('comment', () => {
    it('should return comments', () => {
        const input = '%%This is a comment%%';
        const expected = [
            {
                type: 'paragraph',
                raw: '%%This is a comment%%',
                text: '%%This is a comment%%',
                tokens: [
                    {
                        "type": "obsidian-comment",
                        "raw": "%%This is a comment%%",
                        "text": "This is a comment",
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

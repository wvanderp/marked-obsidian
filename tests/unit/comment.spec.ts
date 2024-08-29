import marked from 'marked';
import MarkedObsidianPlugin from '../../src';
import commentParser from '../../src/extensions/comments';
import exp from 'constants';

describe('comment', () => {
    it('should parse comments', () => {
        const input = '%%This is a comment%%';
        const expected = [
            {
                "type": "obsidian-comment",
                "raw": "%%This is a comment%%",
                "text": "This is a comment",
            }
        ];

        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);
        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });

    it('should parse inline comments', () => {
        const input = 'This is a %%comment%%';
        const expected = [
            {
                type: 'paragraph',
                raw: 'This is a ',
                text: 'This is a ',
                tokens: [
                    {
                        type: 'text',
                        raw: 'This is a ',
                        text: 'This is a ',
                    }
                ]
            },
            {
                type: 'obsidian-comment',
                raw: '%%comment%%',
                text: 'comment',
            }
        ];

        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);
        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });

    it('should parse block comments', () => {
        const input = '%%\nThis is a block comment\n%%';
        const expected = [
            {
                type: 'obsidian-comment',
                raw: '%%\nThis is a block comment\n%%',
                text: 'This is a block comment',
            }
        ];

        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);


        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });
});

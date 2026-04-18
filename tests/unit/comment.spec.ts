import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';
import inlineComment from '../../src/extensions/Comments';

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
                        escaped: false,
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

    describe('inline comment extension', () => {
        it('start should return index when %% is found', () => {
            const start = inlineComment.start!;
            const result = start.call({ lexer: {} } as any, 'hello %%comment%% world');
            expect(result).toBe(6);
        });

        it('start should return undefined when no %% is found', () => {
            const start = inlineComment.start!;
            const result = start.call({ lexer: {} } as any, 'hello world');
            expect(result).toBeUndefined();
        });

        it('tokenizer should return a token for inline comments', () => {
            const tokenizer = inlineComment.tokenizer!;
            const result = tokenizer.call({ lexer: {} } as any, '%%inline comment%%');
            expect(result).toEqual({
                type: 'obsidian-comment',
                raw: '%%inline comment%%',
                text: 'inline comment',
            });
        });

        it('tokenizer should return undefined when no match', () => {
            const tokenizer = inlineComment.tokenizer!;
            const result = tokenizer.call({ lexer: {} } as any, 'no comment here');
            expect(result).toBeUndefined();
        });

        it('renderer should return empty string', () => {
            const renderer = inlineComment.renderer!;
            const result = renderer.call({ parser: {} } as any, {} as any);
            expect(result).toBe('');
        });
    });
});

import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';
import inlineComment from '../../src/extensions/Comments';
import { RendererThis, TokenizerThis, Tokens } from 'marked';
import { ObsidianCommentToken } from '../../src/extensions/Comments';

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
            const tokenizerThis = { lexer: {} } as TokenizerThis;
            const result = start.call(tokenizerThis, 'hello %%comment%% world');
            expect(result).toBe(6);
        });

        it('start should return undefined when no %% is found', () => {
            const start = inlineComment.start!;
            const tokenizerThis = { lexer: {} } as TokenizerThis;
            const result = start.call(tokenizerThis, 'hello world');
            expect(result).toBeUndefined();
        });

        it('tokenizer should return a token for inline comments', () => {
            const tokenizer = inlineComment.tokenizer!;
            const tokenizerThis = { lexer: {} } as TokenizerThis;
            const result = tokenizer.call(tokenizerThis, '%%inline comment%%', [] as Tokens.Generic[]);
            expect(result).toEqual({
                type: 'obsidian-comment',
                raw: '%%inline comment%%',
                text: 'inline comment',
            });
        });

        it('tokenizer should return undefined when no match', () => {
            const tokenizer = inlineComment.tokenizer!;
            const tokenizerThis = { lexer: {} } as TokenizerThis;
            const result = tokenizer.call(tokenizerThis, 'no comment here', [] as Tokens.Generic[]);
            expect(result).toBeUndefined();
        });

        it('renderer should return empty string', () => {
            const renderer = inlineComment.renderer!;
            const context = { parser: {} } as const;
            const token: ObsidianCommentToken = {
                type: 'obsidian-comment',
                raw: '%%%%'
            };
            const result = renderer.call(context as unknown as RendererThis<string, string>, token);
            expect(result).toBe('');
        });
    });
});

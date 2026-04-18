import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';
import walkTokens from '../../src/walkTokens';
import calloutExt from '../../src/extensions/callouts';

describe('callouts', () => {
    it('should change the blockquote type to obsidian-callout', () => {
        const token =        {
            type: "blockquote", raw: "> [!info] callout", tokens: [
                {
                    type: "paragraph", raw: "[!info] callout", text: "[!info] callout", tokens: [
                        { type: "text", raw: "[!info] callout", text: "[!info] callout" }
                    ]
                }
            ], text: "[!info] callout"
        };

        walkTokens(token);

        const expected = {
            type: "obsidian-callout", 
            raw: "callout", 
            calloutType: "info",
            text: "callout",
            tokens: [
                {
                    type: "paragraph", raw: "callout", text: "callout", tokens: [
                        { type: "text", raw: "callout", text: "callout" }
                    ]
                }
            ]
        };

        expect(token).toEqual(expected);
    });

    it('should not change the blockquote type if it does not start with a callout', () => {
        const token =        {
            type: "blockquote", raw: "> This is a block quote", tokens: [
                {
                    type: "paragraph", raw: "This is a block quote", text: "This is a block quote", tokens: [
                        { type: "text", raw: "This is a block quote", text: "This is a block quote" }
                    ]
                }
            ], text: "This is a block quote"
        };

        walkTokens(token);

        const expected = {
            type: "blockquote", raw: "> This is a block quote", tokens: [
                {
                    type: "paragraph", raw: "This is a block quote", text: "This is a block quote", tokens: [
                        { type: "text", raw: "This is a block quote", text: "This is a block quote" }
                    ]
                }
            ], text: "This is a block quote"
        };

        expect(token).toEqual(expected);
    });

    it('should render the callout to html', () => {
        const markdown = `> [!info] Here's a callout block. it supports **Markdown**`;

        const html = marked.use(MarkedObsidianPlugin()).parse(markdown);

        const expected = `<div class="obsidian-callout obsidian-callout-info"><p>Here&#39;s a callout block. it supports <strong>Markdown</strong></p>\n</div>`;
        expect(html).toEqual(expected);
    });

    it('should render callout with no tokens as empty', () => {
        const renderer = calloutExt.renderer!;
        const result = renderer.call(
            { parser: { parse: (t: any) => t } } as any,
            { tokens: undefined, calloutType: 'note' } as any
        );
        expect(result).toBe('<div class="obsidian-callout obsidian-callout-note"></div>');
    });

    it('should handle callout with empty tokens array', () => {
        const token = {
            type: "blockquote",
            raw: "> [!note]",
            text: "[!note]",
            tokens: [] as any[]
        };

        walkTokens(token);

        expect(token.type).toBe('obsidian-callout');
        expect((token as any).calloutType).toBe('note');
    });

    it('should handle callout where paragraph first token is not text', () => {
        const token = {
            type: "blockquote",
            raw: "> [!tip] **bold**",
            text: "[!tip] **bold**",
            tokens: [
                {
                    type: "paragraph",
                    raw: "[!tip] **bold**",
                    text: "[!tip] **bold**",
                    tokens: [
                        { type: "strong", raw: "**bold**", text: "bold", tokens: [] }
                    ]
                }
            ]
        };

        walkTokens(token);

        expect(token.type).toBe('obsidian-callout');
        expect((token as any).calloutType).toBe('tip');
    });
});

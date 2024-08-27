import marked from 'marked';
import MarkedObsidianPlugin from '../../src';
import walkTokens from '../../src/walkTokens';

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
});

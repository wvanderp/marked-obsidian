import { RendererExtension, TokenizerExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianBlockLinkToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-block-link';

    /**
     * the text of the block link
     */
    text?: string;
}

/**
 * This is a tokenizer for obsidian block links
 * 
 * ^quote-of-the-day
 * 
 * @see https://help.obsidian.md/Linking+notes+and+files/Internal+links#Link+to+a+block+in+a+note
 */
export default {
    name: 'obsidian-block-link',
    level: 'inline',
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/\^/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : ObsidianBlockLinkToken | undefined
    {
        const match = src.match(/^\^(.+)/);
        if (match) {
            const [fullMatch, text] = match;
            return {
                type: 'obsidian-block-link',
                raw: fullMatch,
                text: text
            }
        }
    },
    renderer(token: ObsidianBlockLinkToken) {
        return `<i><a href="#${token.text}">${token.text}</a></i>`;
    }
} as (TokenizerExtension & RendererExtension);

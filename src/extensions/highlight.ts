import { RendererExtension, TokenizerExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianHighlightToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-highlight';

    /**
     * the text of the highlight
     */
    text?: string;

    /**
     * the tokens inside the highlight
     */
    tokens?: Tokens.Generic[];
}

/**
 * This is a tokenizer for obsidian highlight
 * 
 * ==Highlighted text==
 * 
 * @see https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Bold%2C+italics%2C+highlights
 */
export default {
    name: 'obsidian-highlight',
    level: 'inline',
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/==/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : Tokens.Generic | undefined
    {
        const match = src.match(/^==(.+?)==/);
        if (match) {
            const [fullMatch, text] = match;
            const token: ObsidianHighlightToken = {
                type: 'obsidian-highlight',
                raw: fullMatch,
                text,
            }

            if (token.text) {
                token.tokens = this.lexer.inline(token.text, token.tokens);
            }

            return token;
        }
    },
    renderer({ tokens }: ObsidianHighlightToken) {
        return `<mark>${tokens ? this.parser.parseInline(tokens) : ''}</mark>`;
    }
} as (TokenizerExtension & RendererExtension);

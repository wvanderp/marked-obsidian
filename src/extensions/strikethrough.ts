import { MarkedToken, Token, TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianStrikethroughToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-strikethrough';
    /**
     * the text of the strikethrough
     */
    text?: string;
    /**
     * the tokens inside the strikethrough
     */
    tokens?: Token[];
}

/**
 * This is a tokenizer for obsidian strikethrough
 * 
 * ~~strikethrough~~
 * 
 * @see https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Bold%2C+italics%2C+highlights
 */
export default {
    name: 'obsidian-strikethrough',
    level: 'inline',
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/~~/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : ObsidianStrikethroughToken | undefined
    {
        const match = src.match(/^~~(.+?)~~/);
        if (match) {
            const [fullMatch, text] = match;
            const token = {
                type: 'obsidian-strikethrough',
                raw: fullMatch,
                text,
            } as ObsidianStrikethroughToken;

            if (token.text && token.text.length > 0) {
                token.tokens = this.lexer.inline(token.text, token.tokens);
            }

            return token;
        }
    },
    renderer({ tokens }: ObsidianStrikethroughToken) {
        return `<s>${tokens ? this.parser.parseInline(tokens) : ''}</s>`;
    }
} as TokenizerAndRendererExtension;

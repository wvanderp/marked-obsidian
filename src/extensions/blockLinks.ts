import { TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

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
    tokenizer(this: TokenizerThis, src: string) : Tokens.Generic | undefined
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
    renderer(this: TokenizerThis, tokens: Tokens.Generic[], idx: number) : string {
        const token = tokens[idx];
        return `<i><a href="#${token.text}">${token.text}</a></i>`;
    }
} as TokenizerAndRendererExtension;

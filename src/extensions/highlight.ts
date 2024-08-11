import { TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

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
            return {
                type: 'obsidian-highlight',
                raw: fullMatch,
                text,
            }
        }
    },
    renderer(this: TokenizerThis, tokens: Tokens.Generic[]) : string {
        return `<mark>${tokens.map(t => t.text).join('')}</mark>`;
    }
} as TokenizerAndRendererExtension;

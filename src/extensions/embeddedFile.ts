import { TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

/**
 * This is a tokenizer for obsidian embedded files, like images, pdfs, etc.
 * 
 * ![[Link]]
 * 
 * @see https://help.obsidian.md/Linking+notes+and+files/Embed+files
 */
export default {
    name: 'obsidian-embedded-file',
    level: 'inline',
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/\!\[\[/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : Tokens.Generic | undefined
    {
        const match = src.match(/^\!\[\[([^\]]+)\]\]/);
        if (match) {
            const [fullMatch, text] = match;
            return {
                type: 'obsidian-embedded-file',
                raw: fullMatch,
                text,
            }
        }
    },
    // TODO: Implement a renderer for this extension
    renderer(this: TokenizerThis, token: Tokens.Generic) : string {
        return `<img src="${token.text}" />`;
    }
} as TokenizerAndRendererExtension;

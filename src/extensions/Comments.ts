import { TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

/**
 * This is a tokenizer for obsidian Comments
 * 
 * %% Comment text here %%
 * 
 * @see https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Comments
 */
export default {
    name: 'obsidian-comment',
    level: 'inline',
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/%%/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : Tokens.Generic | undefined
    {
        const match = src.match(/^%%(.+?)%%/);
        if (match) {
            const [fullMatch, text] = match;
            return {
                type: 'obsidian-comment',
                raw: fullMatch,
                text,
            }
        }
    },
    renderer(this: TokenizerThis) : string {
        return '';
    }
} as TokenizerAndRendererExtension;

import { RendererExtension, TokenizerExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianCommentToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-comment';

    /**
     * the text of the comment
     */
    text?: string;
}

/**
 * This is a tokenizer for obsidian Comments
 * 
 * %% Comment text here %%
 * 
 * but also %% inline comments %%
 * 
 * for the block comments @see commentsBlock.ts
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
    tokenizer(this: TokenizerThis, src: string) : ObsidianCommentToken | undefined
    {
        const match = src.match(/^%%(.+?)%%/s);

        if (match) {
            const [fullMatch, text] = match;

            console.log('fullMatch', text);
            return {
                type: 'obsidian-comment',
                raw: fullMatch,
                text,
            }
        }
    },
    renderer() : string {
        return '';
    }
}  as (TokenizerExtension & RendererExtension);

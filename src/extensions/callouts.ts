import { RendererExtension, RendererThis, TokenizerExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianCalloutToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-callout';

    /**
     * the text of the callout
     */
    text?: string;

    /**
     * the type of the callout
     */
    calloutType?: string;

    /**
     * the tokens inside the callout
     */
    tokens?: Tokens.Generic[];
}

/**
 * This is a tokenizer for obsidian callouts
 * 
 * > [!info]
 * > Here's a callout block.
 * > It supports **Markdown**, [[Internal link|Wikilinks]], and [[Embed files|embeds]]!
 * > ![[Engelbart.jpg]]
 * 
 * @see https://help.obsidian.md/Editing+and+formatting/Callouts
 */
export default {
    name: 'obsidian-callout',
    level: 'block',
    renderer({ tokens, calloutType }: Tokens.Generic) {
        return `<div class="obsidian-callout obsidian-callout-${calloutType}">${tokens ? this.parser.parse(tokens) : ''}</div>`;
    }
} as (TokenizerExtension & RendererExtension);

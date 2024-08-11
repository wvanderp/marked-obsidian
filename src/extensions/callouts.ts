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
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/^> \[\!\w+\]/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : Tokens.Generic | undefined
    {
        const match = src.match(/^> \[\!(\w+)\](.*)$/);
        if (match) {
            const [fullMatch, type, text] = match;
            return {
                type: 'obsidian-callout',
                raw: fullMatch,
                text,
                calloutType: type
            }
        }
    },
    // TODO: add real rendering
    renderer(this: RendererThis, token: Tokens.Generic) : string {
        return `<div class="obsidian-callout obsidian-callout-${token.calloutType}">${token.text}</div>`;
    }
} as (TokenizerExtension & RendererExtension);

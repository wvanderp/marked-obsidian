import { TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

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
        const match = src.match(/> \[\!\w+\]/);
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
    renderer(this: TokenizerThis, tokens: Tokens.Generic[], idx: number) : string {
        const token = tokens[idx];
        return `<div class="obsidian-callout obsidian-callout-${token.calloutType}">${token.text}</div>`;
    }
} as TokenizerAndRendererExtension;

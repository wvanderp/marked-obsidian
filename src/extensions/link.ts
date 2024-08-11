import { RendererExtension, RendererThis, TokenizerExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianLinkToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-link';
    /**
     * the page that the link is pointing to
     */
    link?: string;
    /**
     * the text of the link. this is the text that is displayed in obsidian
     * it can be a combination of the link, the section and the block reference
     * the rules are a bit complicated so best to use the other properties if you have a specific use case in mind
     * this property is fine to use if you want to display the link as it is in obsidian
     */
    text?: string;
    /**
     * the section of the link
     */
    section?: string;
    /**
     * the block reference of the link
     */
    blockReference?: string;
    /**
     * the display text of the
     * note that this might not be the same as the text property
     */
    displayText?: string;
}

/**
 * link parser
 * this function will help the tokenizer to parse the contents of the link
 * 
 * the links can have four parts:
 * 
 * 1. the link itself
 * [[Three laws of motion]]
 * 
 * 2. the link and the text
 * [[Three laws of motion|Newton's laws]]
 * 
 * 3. a link with a section
 * [[Three laws of motion#First law]]
 * 
 * 4. a link with a block reference
 * [[Three laws of motion#^First law]]
 * 
 * and all of these can be mixed and matched
 * 
 * @see https://help.obsidian.md/Linking+notes+and+files/Internal+links
 * 
 * @param {string} src - the source string
 * @returns {object} - the parsed link
 * @example
 */
export function parseLink(src: string): { link?: string, text?: string, section?: string, blockReference?: string, displayText?: string } {
    const match = src.match(/\[\[([^\]]+)\]\]/);
    if (!match) {
        throw new Error('Invalid link');
    }
    const [_, innerPart] = match;

    // split on the pipe to get the display text and the other stuff of the link
    const parts = innerPart.split('|');

    // the first part is the link because everything after the pipe is the display text
    let link: string | undefined = parts[0];

    // the display text is everything after the first pipe
    let displayText: string | undefined = parts.length > 1 ? parts.slice(1).join('|') : undefined;

    const splitForSection = link.split('#');
    const sectionOrBlockReference = splitForSection[1];


    // if there is a section or block reference then we need to remove it from the link
    // and we know that the link is the first part of the split
    if (sectionOrBlockReference) {
        link = splitForSection[0];
    }


    let section: string | undefined = undefined;
    let blockReference: string | undefined = undefined;

    if (sectionOrBlockReference && !sectionOrBlockReference.startsWith('^')) {
        section = sectionOrBlockReference;
    }


    if (sectionOrBlockReference && sectionOrBlockReference.startsWith('^')) {
        blockReference = sectionOrBlockReference.replace('^', '');
    }

    // if the link is empty then we know that the section is the start of the link
    // and the block reference is the start of the section
    // then we know that the original link was like this [[#^blockReference]]
    // which means that the block reference is actually the section
    if (link === '' && sectionOrBlockReference.startsWith('^')) {
        section = sectionOrBlockReference;
        blockReference = undefined;
    }

    let text = displayText

    if (!text) {
        if (link) {
            text = `${link}${section ? `#${section}` : ''}${blockReference ? `#^${blockReference}` : ''}`;
        } else if (section) {
            text = section;
        } else if (blockReference) {
            text = `^${blockReference}`;
        }
    }

    if (link === '') {
        link = undefined;
    }



    // if the # is the first character then we should remove it
    if (text?.startsWith('#')) {
        text = text.replace('#', '');
    }

    // pipes in display text are not shown
    if (text?.includes('|')) {
        text = text.replaceAll('|', '');
    }

    // if the display text contains a # then we it is still used as a section link
    // but only if there is no real section link
    if (!section && displayText?.includes('#')) {
        section = displayText.replaceAll('#', '');
    }

    return {
        link,
        text,
        section,
        blockReference,
        displayText
    };

}
/**
 * This is a tokenizer for obsidian links
 * 
 * [[link]]
 * 
 * @see https://help.obsidian.md/Linking+notes+and+files/Internal+links
 */
export default {
    name: 'obsidian-link',
    level: 'inline',
    start(this: TokenizerThis, src: string): number | void {
        const match = src.match(/\[\[/);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string): Tokens.Generic | undefined {
        const match = src.match(/^\[\[([^\]]+)\]\]/);

        if (match) {
            const [fullMatch, _] = match;

            const { link, text, section, blockReference, displayText } = parseLink(fullMatch);

            return {
                type: 'obsidian-link',
                raw: fullMatch,
                text,

                // custom properties
                link,
                section,
                blockReference,
                displayText
            }
        }
    },
    renderer(this: RendererThis, token: ObsidianLinkToken): string {
        const href = `${token.link ? token.link : ''}${token.section ? `#${token.section}` : ''}${token.blockReference ? `#^${token.blockReference}` : ''}`;
        return `<a href="${href}">${token.text}</a>`;
    }
} as (TokenizerExtension & RendererExtension);

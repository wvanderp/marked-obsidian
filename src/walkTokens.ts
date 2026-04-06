import { Token, Tokens } from 'marked';
import { text } from 'stream/consumers';

/***
 * This function is called for each token in the markdown document
 * 
 * we are going to use it to fix all the weirdness we have done to the tokens
 */
export default function walkTokens(token: Token): void | Promise<void> {
    /**
     * Fix the list task tokens
     * 
     * We need to change the results of the task list a bit.
     * In commonmark, you need to use [x] or [X] to check a task list item
     * In obsidian, you can use any character inside the brackets to check a task list item
     * 
     * So we need to change the checked property to be true if there is any character inside the brackets
     */
    if (token.type === 'list_item') {
        const match = token.raw.trim().match(/^\- \[(.)\] (.*)$/)

        if (!match) return

        const [_, checkMark, text] = match

        
        // we should have gmf enabled so it should be a task list item
        // and so we don't have to change some of the tokens
        if (checkMark === ' ' && token.task && !token.checked) return

        token.task = true
        token.checked = checkMark !== ' '
        token.text = text

        // Marked now emits a dedicated checkbox token for task items.
        // For Obsidian-style checked markers (e.g. [V]), add it explicitly.
        if (token.checked && token.tokens && token.tokens[0]?.type !== 'checkbox') {
            token.tokens.unshift({
                type: 'checkbox',
                raw: `[${checkMark}] `,
                checked: true
            })
        }

        // remove the check mark from the text
        const textTokenIndex = token.tokens && token.tokens[0]?.type === 'checkbox' ? 1 : 0
        if (token.tokens && token.tokens[textTokenIndex] && token.tokens[textTokenIndex].type === 'text' && token.tokens[textTokenIndex].text.startsWith('[')) {
            token.tokens[textTokenIndex].text = token.tokens[textTokenIndex].text.replace(/^\[(.)\] /, '');
            token.tokens[textTokenIndex].raw = token.tokens[textTokenIndex].raw.replace(/^\[(.)\] /, '');

            // splice off the first token of this token
            ((token.tokens[textTokenIndex]) as Tokens.Text)?.tokens?.splice(0, 1)

            // if tokens is empty, remove it
            if (((token.tokens[textTokenIndex]) as Tokens.Text)?.tokens?.length === 0) {
                delete ((token.tokens[textTokenIndex]) as Tokens.Text)?.tokens;
            }
        }
    }

    /**
     * If the blockquote starts with the right callout syntax, we need to change the type of the blockquote
     * 
     * > [!info]
     * > This is a callout
     * 
     * should be converted to
     * the format for a callout is anything that starts with > [!calloutType]
     * 
     * We need to change the type of the blockquote to obsidian-callout
     * and add the calloutType property to the token
     */
    if (token.type === 'blockquote') {
        const match = token.raw.trim().match(/^> \[!(\w+)\]/)

        if (!match) return

        const [_, calloutType] = match

        token.type = 'obsidian-callout'
        // @ts-expect-error -- we are adding a new property to the token
        token.calloutType = calloutType

        // remove the callout syntax from the text
        token.text = token.text.replace(/^\[!(\w+)\] /, '')
        token.raw = token.raw.replace(/^> \[!(\w+)\] /, '')

        // remove the callout syntax from the tokens
        if (token.tokens && token.tokens[0] &&  token.tokens[0].type === 'paragraph' && token.tokens[0].text.startsWith('[!')) {
            token.tokens[0].text = token.tokens[0].text.replace(/^(\[!\w+\]) /, '');
            token.tokens[0].raw = token.tokens[0].raw.replace(/^(\[!\w+\]) /, '');

            // also remove the callout syntax from first token of the paragraph
            if (token.tokens[0].tokens && token.tokens[0].tokens[0] &&  token.tokens[0].tokens[0].type === 'text' && token.tokens[0].tokens[0].text.startsWith('[')) {
                token.tokens[0].tokens[0].text = token.tokens[0].tokens[0].text.replace(/^(\[!\w+\]) /, '');
                token.tokens[0].tokens[0].raw = token.tokens[0].tokens[0].raw.replace(/^(\[!\w+\]) /, '');
            }
        }
    }
}

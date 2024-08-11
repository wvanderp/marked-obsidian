import { Token, Tokens } from 'marked';

/***
 * This function is called for each token in the markdown document
 * 
 * we are going to use it to fix all the weirdness we have done to the tokens
 */
export default function walkTokens(token: Token): void | Promise<void> {
    /**
     * fix the list task tokens
     * 
     * we need to change the results of the task list a bit.
     * in commonmark, you need to use [x] or [X] to check a task list item
     * in obsidian, you can use any character inside the brackets to check a task list item
     * 
     * so we need to change the checked property to be true if there is any character inside the brackets
     */
    if (token.type === 'list_item') {
        console.log(JSON.stringify(token, null, 2))
        const match = token.raw.trim().match(/^\- \[(.)\] (.*)$/)

        console.log(match)
        if (!match) return

        const [_, checkMark, text] = match

        
        // we should have gmf enabled so it should be a task list item
        // and so we don't have to change some of the tokens
        if (checkMark === ' ' && token.task && !token.checked) return

        token.task = true
        token.checked = checkMark !== ' '
        token.text = text

        // remove the check mark from the text
        if (token.tokens && token.tokens[0] &&  token.tokens[0].type === 'text') {
            token.tokens[0].text = token.tokens[0].text.replace(/^\[(.)\] /, '');
            token.tokens[0].raw = token.tokens[0].raw.replace(/^\[(.)\] /, '');

            // splice off the first token of this token
            ((token.tokens[0]) as Tokens.Text)?.tokens?.splice(0, 1)
        }

    }
}

import { MarkedToken, Token, TokenizerAndRendererExtension, TokenizerThis, Tokens } from 'marked';

export interface ObsidianTaskListItemToken extends Tokens.Generic {
    /**
     * the type of the token
     */
    type: 'obsidian-task-list-item';

    /**
     * the text of the task list item
     */
    text?: string;

    /**
     * whether the task is checked
     */
    checked?: boolean;

    /**
     * the tokens inside the task list item
     */
    tokens?: Token[];

    /**
     * The character used to check the task list item
     */
    checkMark?: string;
}

/**
 * This is a tokenizer for obsidian task list items
 * 
 * Its very similar to the task list item in github flavored markdown
 * https://github.github.com/gfm/#task-list-items-extension-
 * 
 * but it differs in what is considered checked. 
 * in github flavored markdown, You can only check a task list item by using [x] or [X]
 * in obsidian, you can check a task list item by using any character inside the brackets
 * 
 * - [x] checked
 * - [v] checked
 * - [ ] unchecked
 * - [$] checked
 * 
 * @see https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Task+lists
 */
export default {
    name: 'obsidian-task-list-item',
    level: 'block',
    start(this: TokenizerThis, src: string) : number | void {
        const match = src.match(/\- \[.+\] /);
        if (match) {
            return match.index!;
        }
    },
    tokenizer(this: TokenizerThis, src: string) : ObsidianTaskListItemToken | undefined
    {
        const match = src.match(/^\- \[(.+)\] (.+)$/);
        if (match) {
            const [fullMatch, checkMark, text] = match;
            const token = {
                type: 'obsidian-task-list-item',
                raw: fullMatch,
                text,
                checked: checkMark !== ' ',
                checkMark,
            } as ObsidianTaskListItemToken;

            if (token.text && token.text.length > 0) {
                token.tokens = this.lexer.inline(token.text, token.tokens);
            }

            return token;
        }
    },
    renderer({ tokens, checked }: ObsidianTaskListItemToken) {
        return `<input type="checkbox" ${checked ? 'checked' : ''} disabled> ${tokens ? this.parser.parseInline(tokens) : ''}`;
    }
} as TokenizerAndRendererExtension;

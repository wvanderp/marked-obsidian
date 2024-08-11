import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

describe('callouts', () => {
    it('should return callouts', () => {
        const input = '> [!info]\n> This is a callout';
        const expected = [
            {
                "type": "obsidian-callout",
                "raw": "> [!info]\n> This is a callout",
                "text": "This is a callout",
                "calloutType": "info",
                "tokens": [
                    {
                        "type": "paragraph",
                        "raw": "This is a callout",
                        "text": "This is a callout",
                        "tokens": [
                            {
                                "type": "text",
                                "raw": "This is a callout",
                                "text": "This is a callout"
                            }
                        ]
                    }
                ]
            }
        ];

        const tokens = marked
            .use(MarkedObsidianPlugin())
            .lexer(input);
        expect(JSON.stringify(tokens, null, 2)).toEqual(JSON.stringify(expected, null, 2));
    });
});

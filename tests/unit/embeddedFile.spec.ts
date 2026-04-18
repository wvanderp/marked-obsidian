import { marked } from 'marked';
import MarkedObsidianPlugin from '../../src';

describe('embeddedFile', () => {
    it('should parse embedded file links', () => {
        const input = 'Check this ![[image.png]] out';

        const tokens = marked.use(MarkedObsidianPlugin()).lexer(input);

        const paragraph = tokens[0];
        expect(paragraph.type).toBe('paragraph');
        const embeddedToken = (paragraph as any).tokens.find((t: any) => t.type === 'obsidian-embedded-file');
        expect(embeddedToken).toEqual({
            type: 'obsidian-embedded-file',
            raw: '![[image.png]]',
            text: 'image.png',
        });
    });

    it('should render embedded files as img tags', () => {
        const input = '![[photo.jpg]]';

        const html = marked.use(MarkedObsidianPlugin()).parse(input);

        expect(html).toContain('<img src="photo.jpg" />');
    });
});

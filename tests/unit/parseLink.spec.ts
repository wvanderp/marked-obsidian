import { parseLink } from '../../src/extensions/link';

describe.only('parseLink', () => {
    it('should parse a simple link', () => {
        const link = parseLink('[[Three laws of motion]]');
        expect(link).toEqual({
            link: 'Three laws of motion',
            text: 'Three laws of motion',
            section: undefined,
            blockReference: undefined,
            displayText: undefined
        });
    });
    it('should parse a link with text', () => {
        const link = parseLink('[[Three laws of motion|Newton\'s laws]]');
        expect(link).toEqual({
            link: 'Three laws of motion',
            text: 'Newton\'s laws',
            section: undefined,
            blockReference: undefined,
            displayText: 'Newton\'s laws'
        });
    });
    it('should parse a link with a section', () => {
        const link = parseLink('[[Three laws of motion#First law]]');
        expect(link).toEqual({
            link: 'Three laws of motion',
            text: 'Three laws of motion#First law',
            section: 'First law',
            blockReference: undefined,
            displayText: undefined
        });
    });
    it('should parse a link with a section and display text', () => {
        const link = parseLink('[[Three laws of motion#First law|Newton\'s laws]]');
        expect(link).toEqual({
            link: 'Three laws of motion',
            text: 'Newton\'s laws',
            section: 'First law',
            blockReference: undefined,
            displayText: 'Newton\'s laws'
        });
    });
    it('should parse a link with a block reference', () => {
        const link = parseLink('[[Three laws of motion#^First law]]');
        expect(link).toEqual({
            link: 'Three laws of motion',
            text: 'Three laws of motion#^First law',
            section: undefined,
            blockReference: 'First law',
            displayText: undefined
        });
    });
    it('should parse a link with all parts', () => {
        const link = parseLink('[[Three laws of motion#^First law|Newton\'s laws]]');
        expect(link).toEqual({
            link: 'Three laws of motion',
            text: 'Newton\'s laws',
            section: undefined,
            blockReference: 'First law',
            displayText: 'Newton\'s laws'
        });
    });
    it('should parse a heading to the same note', () => {
        const link = parseLink('[[#Heading]]');
        expect(link).toEqual({
            link: undefined,
            text: 'Heading',
            section: 'Heading',
            blockReference: undefined
        });
    });
    it('should parse a block reference to the same note', () => {
        const link = parseLink('[[^Heading]]');
        expect(link).toEqual({
            link: '^Heading',
            text: '^Heading',
            section: undefined,
            blockReference: undefined
        });
    });
    it('you cant make block references to the same note even with display text', () => {
        const link = parseLink('[[^Heading|Heading]]');
        expect(link).toEqual({
            link: '^Heading',
            text: 'Heading',
            section: undefined,
            blockReference: undefined,
            displayText: 'Heading'
        });
    });
    it('should parse a link with #^ should result in a section', () => {
        const link = parseLink('[[#^Heading]]');
        expect(link).toEqual({
            link: undefined,
            text: '^Heading',
            section: '^Heading',
            blockReference: undefined,
            displayText: undefined
        });
    });

    // display text should not be parsed

    it('display text should not be parsed even if it contains a semi block reference', () => {
        const link = parseLink('[[link|^Heading]]');
        expect(link).toEqual({
            link: 'link',
            text: '^Heading',
            section: undefined,
            blockReference: undefined,
            displayText: '^Heading'
        });
    });


    it('display text should not be parsed even if it contains a block reference', () => {
        const link = parseLink('[[link|#^Heading]]');
        expect(link).toEqual({
            link: 'link',
            text: '^Heading',
            section: '^Heading',
            blockReference: undefined,
            displayText: '#^Heading'
        });
    });

    it('display text should not be parsed even if it contains a section', () => {
        const link = parseLink('[[link|#Heading]]');
        expect(link).toEqual({
            link: 'link',
            text: 'Heading',
            section: 'Heading',
            blockReference: undefined,
            displayText: '#Heading'
        });
    });

    it('display text should not be parsed even if it contains another display text', () => {
        const link = parseLink('[[link|text|text]]');
        expect(link).toEqual({
            link: 'link',
            text: 'texttext',
            section: undefined,
            blockReference: undefined,
            displayText: 'text|text'
        });
    });

    it('display text should not be parsed even if it the start of the link', () => {
        // the closing brackets will be parsed off before we get the link
        const link = parseLink('[[text|[[link]]');
        expect(link).toEqual({
            link: 'text',
            text: '[[link',
            section: undefined,
            blockReference: undefined,
            displayText: '[[link'
        });
    });

    it('should only display a # if the display text contains a ##', () => {
        const link = parseLink('[[link|##text]]');
        expect(link).toEqual({
            link: 'link',
            text: '#text',
            section: 'text',
            blockReference: undefined,
            displayText: '##text'
        });
    });

    it('should only not display a # if the display text contains only one #', () => {
        const link = parseLink('[[link|#text]]');
        expect(link).toEqual({
            link: 'link',
            text: 'text',
            section: 'text',
            blockReference: undefined,
            displayText: '#text'
        });
    });

    it('should only not display a | if the are multiple | in the display text', () => {
        const link = parseLink('[[link|test|more|more||nothing]]');
        expect(link).toEqual({
            link: 'link',
            text: 'testmoremorenothing',
            section: undefined,
            blockReference: undefined,
            displayText: 'test|more|more||nothing'
        });
    });

    it('should use the display text as a section if there is no section but the display text contains a #', () => {
        const link = parseLink('[[link|#Heading]]');
        expect(link).toEqual({
            link: 'link',
            text: 'Heading',
            section: 'Heading',
            blockReference: undefined,
            displayText: '#Heading'
        });
    });

    it('should use the real section if there is a section and the display text contains a #', () => {
        const link = parseLink('[[link#heading|#two]]');
        expect(link).toEqual({
            link: 'link',
            text: 'two',
            section: 'heading',
            blockReference: undefined,
            displayText: '#two'
        });
    });   
});

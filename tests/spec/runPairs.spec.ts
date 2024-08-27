// load all files in the directory
// create pairs based on the file name
// run the markdown trough marked
// compare the output with the expected output using the xml.js to json converter

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { X2jOptions, XMLParser } from 'fast-xml-parser';
import marked from 'marked';
import MarkedObsidianPlugin from '../../src';

const testDir = join(__dirname, './pairs');
const files = readdirSync(testDir);

const pairs = files.reduce((acc, file) => {
    const [name] = file.split('.');

    if (acc.some(p => p.name === name)) {
        return acc;
    }

    const markdown = readFileSync(join(testDir, `${name}.md`), 'utf-8');
    const expected = readFileSync(join(testDir, `${name}.html`), 'utf-8');
    acc.push({ name, markdown, expected });
    return acc;
}, [] as { name: string, markdown: string, expected: string }[]);


describe('runPairs', () => {
    pairs.forEach(pair => {
        it(`should match the expected output for ${pair.name}`, () => {
            const markedObsidian = marked.use(MarkedObsidianPlugin());
            const actual = markedObsidian.parse(pair.markdown) as string;

            const options: X2jOptions = {
                ignoreAttributes: false,
                unpairedTags: ["input", "img", "br", "hr", "area", "base", "basefont", "col", "frame", "isindex", "link", "meta", "param", "embed"],
                allowBooleanAttributes: true,
                preserveOrder: true,
            };


            const parser = new XMLParser(options);

            const actualJson = parser.parse(actual);
            const expectedJson = parser.parse(pair.expected);

            
            // if(pair.name === 'Task List') {
            //     console.log("expected", pair.expected);
            //     console.log("actual", actual);
            //     console.log("expectedJson", expectedJson);
            //     console.log("actualJson", actualJson);
            // }
            
            expect(actualJson).toEqual(expectedJson);
        });
    });
});

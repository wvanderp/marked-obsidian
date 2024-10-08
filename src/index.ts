import type { MarkedExtension, TokenizerThis, Tokens } from 'marked'
import link from './extensions/link'
import embeddedFile from './extensions/embeddedFile'
import blockLinks from './extensions/blockLinks'
import comments from './extensions/comments'
import strikethrough from './extensions/strikethrough'
import highlight from './extensions/highlight'
import callouts from './extensions/callouts'
import walkTokens from './walkTokens'
import commentsBlock from './extensions/commentsBlock'

export default function MarkedObsidianPlugin(): MarkedExtension {
    return {
        gfm: true,
        extensions: [
            link,
            embeddedFile,
            blockLinks,
            comments,
            commentsBlock,
            strikethrough,
            highlight,
            callouts
        ],
        walkTokens
    }
}

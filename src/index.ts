import type { MarkedExtension, TokenizerThis, Tokens } from 'marked'
import link from './extensions/link'
import embeddedFile from './extensions/embeddedFile'
import blockLinks from './extensions/blockLinks'
import comments from './extensions/Comments'
import strikethrough from './extensions/strikethrough'
import highlight from './extensions/highlight'
import callouts from './extensions/callouts'
import taskListItem from './extensions/taskListItem'

export default function MarkedObsidianPlugin() : MarkedExtension {
    return {
        extensions: [
            link,
            embeddedFile,
            blockLinks,
            comments,
            strikethrough,
            highlight,
            callouts,
            taskListItem
        ],
    }
}

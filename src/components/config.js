const blessed = require("blessed");
import Component from "./component";

export default class ConfigComponent extends Component {

    constructor() {
        super();

        this.component = blessed.box({
            top: "0%",
            height: "190",
            align: "right",
            left: "75%",
            width: "25%",
            padding: { top: 1, left: 1, right: 1, bottom: 0 },
            tags: true,
        });
    }

    render(data) {
        if (!super.render(data)) return;

        let content = "";

        if (data.config && data.config.server) {
            const nodeaddr = `${data.config.server.protocol}://${data.config.server.host}:${data.config.server.port}`;
            content += `{bold}{white-fg}${nodeaddr}{/white-fg} (me)  {/bold}`;
        }

        if (data.config && data.config.peers && Array.isArray(data.config.peers)) {
            for (const peer of data.config.peers) {
                if (peer && peer.protocol && peer.host && peer.port) {
                    const peeraddr = `${peer.protocol}://${peer.host}:${peer.port}`;
                    content += `\n{white-fg}${peeraddr}{/white-fg} (${peer.synctype || 'unknown'})`;
                }
            }
        }

        this.component.setContent(content);
    }
}
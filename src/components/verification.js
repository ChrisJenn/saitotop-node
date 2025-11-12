const blessed = require("blessed");
import Component from "./component";

export default class VerificationComponent extends Component {

    constructor() {
        super();

        this.component = blessed.box({
            align: 'left',
            top: "200",
            tags: true,
            left: '50%',
            scrollable: true,
            mouse: true,
            border: "line",
            label: "Verification",
            width: '25%',
            height: '25%',
            tags: true
        });
    }

    render(data) {
        if (!super.render(data)) return;

        const stats = data["stats"];
        if (!stats) {
            this.component.setContent("");
            return;
        }

        let content = "";

        // Get stats from verification:: events (not verification_0::, etc.)
        let invalid_txs = 0;
        if (stats["verification::invalid_txs"] && stats["verification::invalid_txs"]["stats"] && stats["verification::invalid_txs"]["stats"]["total"]) {
            invalid_txs = stats["verification::invalid_txs"]["stats"]["total"]["value"] || 0;
        }

        let processed_blocks = 0;
        if (stats["verification::processed_blocks"] && stats["verification::processed_blocks"]["stats"] && stats["verification::processed_blocks"]["stats"]["total"]) {
            processed_blocks = stats["verification::processed_blocks"]["stats"]["total"]["value"] || 0;
        }

        let processed_msgs = 0;
        if (stats["verification::processed_msgs"] && stats["verification::processed_msgs"]["stats"] && stats["verification::processed_msgs"]["stats"]["total"]) {
            processed_msgs = stats["verification::processed_msgs"]["stats"]["total"]["value"] || 0;
        }

        let processed_txs = 0;
        if (stats["verification::processed_txs"] && stats["verification::processed_txs"]["stats"] && stats["verification::processed_txs"]["stats"]["total"]) {
            processed_txs = stats["verification::processed_txs"]["stats"]["total"]["value"] || 0;
        }


        content += `{white-fg}{bold}MSGS:     ${processed_msgs}{/bold}{/white-fg}\n`;
        content += `{white-fg}{bold}BLOCKS:   ${processed_blocks}{/white-fg}\n`;
        content += `{white-fg}{bold}TXS:      ${processed_txs}{/white-fg}\n`;
        content += `{white-fg}{bold}BAD TXS:  ${invalid_txs}{/white-fg}\n`;
        if (data.config && data.config.server && data.config.server.verification_threads !== undefined) {
            content += `{white-fg}{bold}THREADS:  ${data.config.server.verification_threads}{/bold}{/white-fg}\n`;
        }

        // Display verification thread queues (verification_0::channel, verification_1::channel, etc.)
        for (const stat of Object.keys(stats)) {
            if (stat.startsWith("verification_") && stat.endsWith("::channel")) {
                const statData = stats[stat];
                if (statData && statData["stats"] && statData["stats"]["capacity"]) {
                    const queue_num = Number(stat.split("::")[0].split("_")[1]) + 1;
                    const queue = statData["stats"]["capacity"]["value"];
                    content += `{white-fg}{bold}QUEUE${queue_num}:   ${queue}{/bold}{/white-fg}\n`;
                }
            }
        }

        this.component.setContent(content);
    }
}
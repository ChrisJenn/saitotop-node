const blessed = require("blessed");
import Component from "./component";

export default class NetworkingComponent extends Component {

    constructor() {
        super();
        this.component = blessed.box({
            align: 'left',
            top: "200",
            tags: true,
            left: '0%',
            scrollable: true,
            mouse: true,
            border: "line",
            label: "Networking",
            width: '25%',
            height: '25%',
            tags: true
        });
    }

    render(data) {
        if (!super.render(data)) return;

        const stats = data["stats"];
        if (!stats) {
            this.component.hide();
            return;
        }

        // Hide if no relevant data exists (network:: events don't exist in the stats file)
        if (!stats["network::incoming_msgs"] && !stats["network::outgoing_msgs"]) {
            this.component.hide();
            return;
        }

        this.component.show();

        let content = "";
        content += this.renderStat(data["stats"], "IN", "network::incoming_msgs", "total", 5);
        content += this.renderStat(data["stats"], "OUT", "network::outgoing_msgs", "total", 5);
        content += this.renderStat(data["stats"], "QUEUE", "network::queue", "capacity", 5, false);
        this.component.setContent(content);
    }
}
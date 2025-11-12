const blessed = require("blessed");
import Component from "./component";

export default class DebugComponent extends Component {

    constructor() {
        super();

        this.component = blessed.box({
            width: "50%",
            height: "70%",
            left: "25%",
            right: "25%",
            top: "15%",
            bottom: "15%",
            mouse: true,
            scrollable: true,
            draggable: true,
            hidden: true,
            border: "line",
            label: "Debug",
            tags: true,
            padding: 1,
        });
    }

    toggle() {
        if (this.component.visible) {
            this.component.hide();
        } else {
            this.component.show();
        }
    }

    render(data) {
        // Debug component doesn't need to check active state like other components
        // It's toggled manually, so always render if data exists
        
        // Save current scroll position before updating
        // blessed stores scroll position in childBase property for scrollable elements
        let savedScrollPosition = null;
        if (this.component.scrollable && this.component.childBase !== undefined) {
            savedScrollPosition = this.component.childBase;
        }
        
        if (!data || !data.stats) {
            if (!this.component.hidden) {
                this.component.setContent("");
            }
            return;
        }

        const events = Object.keys(data.stats);
        events.sort();

        let content = "";
        for (const event of events) {
            const eventData = data.stats[event];
            if (!eventData) {
                continue;
            }
            
            // Split event name at :: to get category and subcategory
            const eventParts = event.split('::');
            const category = eventParts[0] || event;
            const subcategory = eventParts[1] || '';
            
            // Display as "category: subcategory" or just "category" if no subcategory
            if (subcategory) {
                content += `{bold}${category}: ${subcategory}{/bold}\n`;
            } else {
                content += `{bold}${category}{/bold}\n`;
            }
            
            // Check if stats exist
            if (!eventData.stats) {
                content += `  {yellow-fg}(no stats property){/yellow-fg}\n\n\n`;
                continue;
            }
            
            const stats = eventData.stats;
            const statKeys = Object.keys(stats);
            
            if (statKeys.length === 0) {
                content += `  {yellow-fg}(stats object is empty){/yellow-fg}\n\n\n`;
                continue;
            }
            
            // Display each stat
            for (const statKey of statKeys) {
                const stat = stats[statKey];
                if (stat && stat.value !== undefined) {
                    content += `  ${statKey}: ${stat.value}\n`;
                } else if (stat) {
                    content += `  ${statKey}: {yellow-fg}(no value){/yellow-fg}\n`;
                }
            }

            content += "\n\n";
        }
        
        // Always set content to replace any previous content
        // Clear any existing content first to prevent accumulation
        this.component.setContent("");
        this.component.setContent(content);
        
        // Restore scroll position if it was saved
        if (savedScrollPosition !== null && savedScrollPosition > 0) {
            // Set the childBase property directly to restore scroll position
            this.component.childBase = savedScrollPosition;
            // Force a re-render to apply the scroll position
            this.component.screen.render();
        }
    }
}

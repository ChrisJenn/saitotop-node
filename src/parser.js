export default class Parser {
    static parse(line) {
        const parsed = { stats: {} };

        // saito bugs
        line = line.replace("--- stats ------ ", "");
        line = line.replace("mempool:state", "mempool::state");
        line = line.replace("routing:sync_state", "routing::sync_state");

        // Handle timestamp prefix: "YYYY-MM-DD HH:MM:SS.mmm UTC - event - stats"
        // Remove timestamp if present (format: date time UTC -)
        line = line.replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+\s+UTC\s+-\s+/, "");

        const parts = line.split(/\s+-\s+/);
        if (parts.length < 2) {
            throw new Error(`Invalid line format: missing separator. Line: ${line}`);
        }

        const [event, rest] = parts;
        if (!event || !rest) {
            throw new Error(`Invalid line format: missing event or data. Line: ${line}`);
        }

        parsed.event = event.trim();

        if (!rest.trim()) {
            // Event exists but no stats - return event with empty stats
            return parsed;
        }

        // Split by commas first, but also handle space-separated key:value pairs
        // Some stats are separated by spaces instead of commas (e.g., "key1 : value1 key2 : value2")
        const params = rest.split(/\s*\,\s*/);
        for (const param of params) {
            if (!param.trim()) continue;
            
            // Check if this param contains multiple space-separated key:value pairs
            // Pattern: "key1 : value1 key2 : value2" (no commas)
            const spaceSeparatedPairs = param.match(/(\w+)\s*:\s*([^:]+?)(?=\s+\w+\s*:|$)/g);
            
            if (spaceSeparatedPairs && spaceSeparatedPairs.length > 1) {
                // This param has multiple space-separated pairs
                for (const pair of spaceSeparatedPairs) {
                    const colonIndex = pair.indexOf(':');
                    if (colonIndex === -1) continue;
                    
                    const key = pair.substring(0, colonIndex).trim();
                    let value = pair.substring(colonIndex + 1).trim();
                    
                    if (!key || !value) continue;
                    
                    parsed["stats"][key] = { date: new Date() };
                    
                    try {
                        parsed["stats"][key]["value"] = JSON.parse(value);
                    } catch (e) {
                        parsed["stats"][key]["value"] = value;
                    }
                }
            } else {
                // Single key:value pair (normal case)
                const colonIndex = param.indexOf(':');
                if (colonIndex === -1) {
                    // Skip malformed params without colon
                    continue;
                }

                const key = param.substring(0, colonIndex).trim();
                let value = param.substring(colonIndex + 1).trim();

                if (!key || !value) continue;

                parsed["stats"][key] = { date: new Date() };

                value = value.replace(" full_block_count", ""); // hack

                try {
                    parsed["stats"][key]["value"] = JSON.parse(value);
                } catch (e) {
                    parsed["stats"][key]["value"] = value;
                }
            }
        }

        return parsed;
    }
}
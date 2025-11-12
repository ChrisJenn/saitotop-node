#!/usr/bin/env node

require("dotenv").config();
import SaitoTop from "./saitotop"
import UI from "./ui"

async function main() {
    const ui = new UI();
    SaitoTop("/opt/saito/node/", (data) => {
        ui.update(data);
    });
}

process.on("uncaughtException", (err) => {
    console.log(err);
    process.exit(-1);
});

main();

// TODO: sparklines for current rate?

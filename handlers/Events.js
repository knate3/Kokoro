const  Discord = require("discord.js");
const { join, parse } = require("path");
const klaw = require("klaw");

class EventHandler extends Discord.Collection {
    constructor(client){
        super();
        this.clent = client;
        this.load();
    }

    async load() {
        const path = join(__dirname, "..", "events");
        const start = Date.now();

        klaw(path).on("data", item => {
            const file = parse(item.path);

            if (file.ext && file.ext === ".js") {
                const req = require(join(file.dir, file.base));
                const newReq = new req(this.client, file.name, join(file.dir, file.base));

                this.set(file.name, newReq);

                this.client[newReq.once ? "once" : "on"](newReq.name, (...args) => newReq.execute(...args));
            }
        }).on("end", () => {
            console.log(`Loaded ${this.size} Events in ${Date.now() - start}ms`);
        });
    }
}
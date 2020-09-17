const  Discord = require("discord.js");
const { join, parse } = require("path");
const klaw = require("klaw");

class CommandHandler extends Discord.Collection {
    constructor(client){
        super();
        this.client = client;
        this.load();
    }
    async load() {
        const path = join(__dirname, "..", "commands");
        const start = Date.now();

        klaw(path).on("data", item => {
            const file = parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const cmd = require(join(file.dir, file.base));
            const cmdobj = new cmd(this.client, file.name, join(file.dir, file.base));

            this.set(file.name, cmdobj);
        }).on("end", () => {
            console.log(`Loaded ${this.size} Commands in ${Date.now() - start}ms`);
            return this;
        });
    }

    async reload(command) {
        delete require.cache[command.path];

        const file = require(command.path);
        const req = new file(this.client, command.name, command.path);

        this.set(req.name, req);
    }
}

module.exports = CommandHandler;
const Discord = require("discord.js");

const config = require("../config.json");
const DatabaseHandler = require("../handlers/Database");
const CommandHandler = require("../handlers/Commands");
const EventHandler = require("../handlers/Events");
const SettingsHandler = require("../handlers/Settings");
const PointsHandler = require("../handlers/Points");
const PorfilesHandler = require("../handlers/Profiles");
const InventorysHandler = require("../handlers/Inventorys");
const StrikesHandler = require("../handlers/Strikes");

class Kokoro extends Discord.Client {
    constructor(options){
        super({
            disabledEvents: ["CHANNEL_PINS_UPDATE", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"],
            disableEveryone: true,
            messageCacheMaxSize: 100,
            messageCacheLifetime: 240,
            messageSweepInterval: 300
          });
        this.config = config;
        this.handlers = {};
        this.handlers.database = new DatabaseHandler(this);
        this.handlers.tasks = new TaskHandler(this);
        this.handlers.permissions = new PermissionsHandler(this);
        this.handlers.moderationLog = new ModerationLogHandler(this);
        this.handlers.music = new MusicHandler(this);

        this.settings = new SettingHandler(this);
        this.points = new PointsHandler(this);
        this.profiles = new PorfilesHandler(this);
        this.inventorys = new InventorysHandler(this);
        this.strikes = new StrikesHandler(this);

        this.functions = new FunctionHandler(this);
        this.commands = new CommandHandler(this);
        this.events = new EventHandler(this);

        this.Ready();
    }
    async Ready(){
        await this.database.connect();
        this.login(this.config.TOKEN)
    }
}
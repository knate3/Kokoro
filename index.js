const Kokoro = require("./structures/Client.js");
const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

const client = new Kokoro();

client.Ready();

client.on("disconnect", () => client.console.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.console.log("Bot reconnecting..."))
  .on("error", err => client.console.error(err))
  .on("warn", info => client.console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  client.console.error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
});

process.on("unhandledRejection", client.console.error);

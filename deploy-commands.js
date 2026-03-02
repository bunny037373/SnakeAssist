require("dotenv").config();
const {
  REST,
  Routes,
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = "1291460183750606919";

const commands = [
  new SlashCommandBuilder()
    .setName("floppa")
    .setDescription("Summon a random Floppa")
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel
    ),
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send an anonymous message through the bot")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Message to send anonymously")
        .setRequired(true)
    )
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setContexts(InteractionContextType.Guild)
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registering global slash commands...");

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Global slash commands registered successfully!");
  } catch (error) {
    console.error(error);
  }
})();

require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 4000;
const TOKEN = process.env.DISCORD_TOKEN;

// --- WEB SERVER (Keep-alive) ---
app.get("/", (req, res) => {
  res.send("✅ Bot is running");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// --- DISCORD BOT ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);


  client.user.setPresence({
    status: "online", // online | idle | dnd | invisible
    activities: [
      {
        name: "Do Not Disturb Mode",
        type: ActivityType.Playing
      }
    ]
  });
});

// Event Listener: Respond to messages
client.on("messageCreate", (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Example command
  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }
});

// Global error handling to prevent crash
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.login(TOKEN);

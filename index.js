require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const app = express();
// Render uses port 10000 by default; this ensures the web service stays 'Live'
const PORT = process.env.PORT || 10000; 
const TOKEN = process.env.DISCORD_TOKEN;
const TENOR_KEY = process.env.TENOR_API_KEY;

// --- WEB SERVER (This prevents Render from timing out) ---
app.get("/", (req, res) => {
  res.send("✅ Floppa Bot is awake and running!");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Web server is listening on port ${PORT}`);
});

// --- DISCORD BOT ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Ensure this is enabled in Discord Dev Portal!
  ]
});

let cooldown = false;

// Fetch random Floppa GIF from Tenor (using Node 25 native fetch)
async function getRandomFloppa() {
  try {
    const url = `https://tenor.googleapis.com/v2/search?q=floppa&key=${TENOR_KEY}&limit=20`;
    const response = await fetch(url);
    const json = await response.json();
    
    if (!json.results || json.results.length === 0) return "😭 No Floppa found";

    const randomIndex = Math.floor(Math.random() * json.results.length);
    return json.results[randomIndex].media_formats.gif.url;
  } catch (err) {
    console.error("Fetch Error:", err);
    return "❌ Error getting Floppa";
  }
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    status: "online",
    activities: [{ name: "for !floppa", type: ActivityType.Watching }]
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Trigger on command or keywords
  if (content === "!floppa" || content.includes("buh") || content.includes("bruh")) {
    if (cooldown) return;
    cooldown = true;

    const gif = await getRandomFloppa();
    await message.channel.send(gif);

    setTimeout(() => (cooldown = false), 3000);
  }
});

// Error handling to prevent the bot from crashing silently
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Start the bot
client.login(TOKEN).catch(err => {
  console.error("❌ Failed to login to Discord. Check your TOKEN in Render Environment variables.");
  console.error(err);
});

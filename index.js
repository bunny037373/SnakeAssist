require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch"); // make sure to `npm install node-fetch`
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 4000;
const TOKEN = process.env.DISCORD_TOKEN;
const TENOR_KEY = process.env.TENOR_API_KEY; // get your API key from Tenor

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

let cooldown = false;

async function getRandomFloppa() {
  try {
    const response = await fetch(
      `https://tenor.googleapis.com/v2/search?q=floppa&key=${TENOR_KEY}&limit=20&media_filter=minimal`
    );
    const json = await response.json();
    const results = json.results;
    if (!results || results.length === 0) return "No Floppa found 😭";

    const randomIndex = Math.floor(Math.random() * results.length);
    const gifUrl = results[randomIndex].media_formats.gif.url;
    return gifUrl;
  } catch (err) {
    console.error("Error fetching Floppa GIF:", err);
    return "Error getting Floppa 😭";
  }
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.user.setPresence({
    status: "online",
    activities: [{ name: "Floppa is watching", type: ActivityType.Playing }]
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // --- !floppa command ---
  if (content === "!floppa") {
    if (cooldown) return;
    cooldown = true;

    const gif = await getRandomFloppa();
    await message.channel.send(gif);

    setTimeout(() => (cooldown = false), 3000);
  }

  // --- buh / bruh trigger ---
  if ((content.includes("buh") || content.includes("bruh")) && !cooldown) {
    cooldown = true;

    const gif = await getRandomFloppa();
    await message.channel.send(gif);

    setTimeout(() => (cooldown = false), 3000);
  }
});

// Global error handling
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.login(TOKEN);

// ================= IMPORTS =================
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fetch = (...args) => {
    if (typeof globalThis.fetch === 'function') {
        return globalThis.fetch(...args);
    }

    return import('node-fetch').then(({ default: nodeFetch }) => nodeFetch(...args));
};

// ================= EXPRESS KEEP-ALIVE =================
const app = express();
const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => res.send('✅ Bot is running'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// ================= DISCORD CLIENT =================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let cooldown = false;

// ================= HELPERS =================
// Fetch random Floppa GIF from Tenor
async function getRandomFloppa() {
    try {
        const response = await fetch(
            `https://tenor.googleapis.com/v2/search?q=floppa&key=${process.env.TENOR_API_KEY}&limit=20&media_filter=minimal`
        );
        const data = await response.json();
        const results = data.results;
        if (!results || results.length === 0) return "😭 No Floppa found";
        const index = Math.floor(Math.random() * results.length);
        return results[index].media_formats.gif.url;
    } catch (err) {
        console.error('Error fetching Floppa GIF:', err);
        return '❌ Error getting Floppa';
    }
}

// ================= CLIENT EVENTS =================
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: 'online',
        activities: [{ name: 'Floppa memes', type: ActivityType.Playing }]
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    // !floppa command
    if (msg === '!floppa') {
        if (cooldown) return;
        cooldown = true;
        const gif = await getRandomFloppa();
        message.channel.send(gif);
        setTimeout(() => cooldown = false, 3000); // 3-second cooldown
    }

    // "buh" / "bruh" trigger
    if ((msg.includes('buh') || msg.includes('bruh')) && !cooldown) {
        cooldown = true;
        const gif = await getRandomFloppa();
        message.channel.send(gif);
        setTimeout(() => cooldown = false, 3000);
    }
});

// ================= ERROR HANDLING =================
process.on('unhandledRejection', console.error);

// ================= LOGIN =================
client.login(process.env.DISCORD_TOKEN);

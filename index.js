require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ---------------- FLOPPA IMAGES ---------------- */

const floppaImages = [
  // Your original ones
  "https://cdn.discordapp.com/attachments/1219622260718047333/1475280124923351344/image.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237750390390915/00.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237750797111358/R.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237751296098597/wp9608133.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237751711596634/8407938.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237752105603152/caracal-cat-restingon-perch-k3s3jtnv4i060jky.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237752646926396/8407931.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237753313562824/8407907.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237753842041045/d0d3a009c1f23c3937bafabf5106d0a6.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475237754127515819/big-floppa.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238447571534085/925774398972dd015142017588cd60c4.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238448028975194/its-floppa-friday-v0-ak7ern2v3o0a1.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238448414589230/m6r24brupa491.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238448980824074/walter-floppa-white-v0-fs8wwr55ccna1.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238449480208555/60b4cf3985600a50dd341bb7.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238449882730670/f133b868d8438818b222d7381adaadb5.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238450629185737/f0ccfad7b02dd8cb892c5b53ada5b15c.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238451455721684/ab28799af864f0db594e9aa273df4b4e.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475238451858112584/343430302_751678373288724_6240394485483171024_n.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240455464550570/ZLCzIgpig35uRVKEdAYJnXBhba4dLIPxJ0mdHLis38RYzUf2hDwjF7MB2HVU2YpJoGEckTA_9gs900-c-k-c0x00ffffff-no-rj.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240456161071175/img63f624f4ad7080.84122409.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240456983150755/387.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240457922412566/OIP.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240459818369205/floppa4.jpg",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240460372152372/floppa6.webp",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240460791447602/floppa7.jpg",
  "https://media.discordapp.net/attachments/1219622260718047333/1475240461152293034/floppa8.jpg",

  // New ones
  "https://cdn.discordapp.com/attachments/1219622260718047333/1475280387348500560/image.png",
  "https://cdn.discordapp.com/attachments/1219622260718047333/1475280387759673440/image.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475280388111728680/image.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475280388506255430/image.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475280389084811355/image.png",
  "https://media.discordapp.net/attachments/1219622260718047333/1475280389940707460/image.png"
];

/* ---------------- SLASH COMMAND ---------------- */

const command = new SlashCommandBuilder()
  .setName("floppa")
  .setDescription("Send a random floppa 🐆")
  .setIntegrationTypes([0, 1]) // Guild + User install
  .setContexts([0, 1, 2]);     // Guilds, Bot DMs, User DMs

/* ---------------- REGISTER COMMAND ---------------- */

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering /floppa...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [command.toJSON()] }
    );
    console.log("Slash command registered.");
  } catch (error) {
    console.error(error);
  }
})();

/* ---------------- INTERACTION HANDLER ---------------- */

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "floppa") return;

  try {
    await interaction.deferReply(); // Prevent timeout

    const randomImage =
      floppaImages[Math.floor(Math.random() * floppaImages.length)];

    const embed = new EmbedBuilder()
      
      .setImage(randomImage)
      .setColor(0xff9900);

    await interaction.editReply({ embeds: [embed] });

  } catch (err) {
    console.error("Floppa error:", err);
  }
});

/* ---------------- LOGIN ---------------- */

client.login(process.env.TOKEN);

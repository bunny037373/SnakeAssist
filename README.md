# Floppa Discord Bot

A simple Discord bot that posts random Floppa GIFs from Tenor.

## Features
- Responds to `!floppa` with a random Floppa GIF.
- Reacts to messages containing `buh` or `bruh`.
- Includes a lightweight Express health-check server for hosting platforms.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   TENOR_API_KEY=your_tenor_api_key
   PORT=4000
   ```
3. Start the bot:
   ```bash
   npm start
   ```

## Notes
- Invite your Discord application bot user to your server with message read/send permissions.
- The bot includes a short global cooldown to avoid spam.

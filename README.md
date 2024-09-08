# MESA Discord Bot

## Description
The MESA Discord Bot is designed for the Mathematics, Engineering, Science, Achievement (MESA) program at Los Angeles City College. This bot fetches the latest announcements from Canvas and sends them to a designated Discord channel. Additionally, it features a QR code generator and various other functionalities to enhance communication and engagement within the MESA community.

## Project Structure
```
├── commands/               # Contains command files for the bot
├── core/                   # Core functionalities and utilities
│   ├── canvasAPI.js        # Handles fetching announcements from Canvas
│   ├── db.js               # Database operations
│   ├── htmlGenerator.js    # Generates HTML for announcements
│   ├── mesa.js             # QR code generation logic
│   └── utils/              # Utility functions
├── events/                 # Event handlers for the bot
├── generator/              # HTML templates and assets for announcements
├── modals/                 # Modal interactions for user inputs
├── schema/                 # Database schema definitions
├── test.js                 # Testing script
├── index.js                # Main entry point for the bot
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── .gitignore              # Files and directories to ignore in version control
```

## Installation Guide
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mesa-discord-bot.git
   cd mesa-discord-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a configuration file:**
   Copy the example configuration file and fill in your details:
   ```bash
   cp example.config.json config.json
   ```

## Changing `config.json`
Edit the `config.json` file to set your bot's token, application ID, Canvas token, and other necessary configurations. The structure of the `config.json` file is as follows:
```json
{
    "TOKEN": "YOUR_DISCORD_BOT_TOKEN",
    "APP_ID": "YOUR_APPLICATION_ID",
    "CANVA_TOKEN": "YOUR_CANVAS_TOKEN",
    "COURSES": ["course_<COURSE_ID>"],
    "GUILD_ID": "YOUR_GUILD_ID",
    "CHANNEL_ID": "YOUR_CHANNEL_ID"
}
```
- **TOKEN**: Your Discord bot token.
- **APP_ID**: The application ID of your bot.
- **CANVA_TOKEN**: Your Canvas API token.
- **COURSES**: An array of course IDs to fetch announcements from.
- **GUILD_ID**: The ID of your Discord server.
- **CHANNEL_ID**: The ID of the channel where announcements will be sent.

## Usage Guide
1. **Run the bot:**
   ```bash
   node .
   ```

2. **Interact with the bot:**
   - Use the `/qrgen` command to generate a QR code.
   - The bot will automatically fetch and send announcements to the specified Discord channel.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.
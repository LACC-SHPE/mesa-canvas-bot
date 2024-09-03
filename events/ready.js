const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

var config = require('../config.json');
const canvasAPI = require("../core/canvasAPI")

async function canvaChecker(client) {
    await canvasAPI.fetchAnnouncements().then((announcements) => {
        if (announcements) {
            const channel = client.channels.cache.get(config.CHANNEL_ID);
            console.log("Sending Announcements to " + channel.name);

            const urlBttn = new ButtonBuilder()
                .setLabel("View Announcement")
                .setStyle(ButtonStyle.Link)
                .setURL(announcements.url);

            let buttons = [];
            buttons.push(urlBttn);

            const row = new ActionRowBuilder();
            row.addComponents(buttons);

            // Initialize an empty embeds array
            let embeds = [];

            if (announcements.links.length > 0) {
                const embed = new EmbedBuilder()
                    .setTitle('Resources')
                    .setDescription("Here are some of the links you can find in this announcement!")
                    .setColor(0x0099ff)
                    .setTimestamp();

                // Add each link to the embed
                announcements.links.forEach((link, index) => {
                    const url = new URL(link);
                    if (url.pathname == "/") {
                        embed.addFields({ name: `Link ${index + 1}`, value: `[${url.hostname.replace(/\b\w/g, (c) => c.toUpperCase())}](${link})` });
                    } else {
                        embed.addFields({ name: `Link ${index + 1}`, value: `[${url.pathname.replaceAll('/', ' ').replaceAll('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}](${link})` });
                    }
                });

                // Add the embed to the embeds array
                embeds.push(embed);
            }

            // Create a separate embed for attachments
            if (announcements.attachments.length > 0) {
                const attachmentEmbed = new EmbedBuilder()
                    .setTitle('Attachments')
                    .setDescription("Here are the attachments in this announcement:")
                    .setColor(0x0099ff)
                    .setTimestamp();

                // Add each attachment to the embed
                announcements.attachments.forEach((attachment, index) => {
                    attachmentEmbed.addFields({ name: `Attachment ${index + 1}`, value: `[${attachment.filename}](${attachment.url})` });
                });

                // Add the attachment embed to the embeds array
                embeds.push(attachmentEmbed);
            }

            // Send the message with the embeds array
            channel.send({
                content: `@everyone **${announcements.author}** just posted an announcement!`,
                files: [{ attachment: `./cache/announcement.png`, name: 'announcement.png' }],
                components: [row],
                embeds: embeds
            });
        }
    });
}

module.exports = {
    name: 'ready', 
    once: true,
    async execute(client) { 

        client.user.setActivity({
            name: '🌍 LACC MESA',
            type: ActivityType.Custom,
        });

        setInterval(function() {canvaChecker(client)}, 5000)
    },
};


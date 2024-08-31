const { ActivityType, EmbedBuilder } = require('discord.js');

var config = require('../config.json');

module.exports = {
    name: 'ready', 
    once: true,
    async execute(client) { 

        client.user.setActivity({
            name: '🌍 LACC MESA',
            type: ActivityType.Custom,
        });
    },
};


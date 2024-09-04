const mesa = require('../core/mesa');

module.exports = {
	customID: 'qrgen',
	async execute(interaction, client) {
		const message = interaction.fields.getTextInputValue('message');
		await interaction.deferReply({ ephemeral: true });

        try {
            const qrcode = await mesa.generateQRCode(message);
            await interaction.channel.send({
                files: [{ attachment: qrcode, name: 'generatedqrcode-mesa.png' }],
                content: `Successfully generated the QR code!`
            });
		} catch (error) {
            console.error(error);
			await interaction.editReply('Failed to send message - Check I have permission to send messages in this channel!');
		}
	}
}
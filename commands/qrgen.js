const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qrgen')
		.setDescription('Generate a QR code!'),
	async execute(interaction, client) {
		const modal = new ModalBuilder()
		.setTitle('QR Code Generator | MESA')
		.setCustomId('qrgen')

		const input = new TextInputBuilder()
		.setCustomId('message')
		.setPlaceholder('Type a url....')
		.setLabel('Url')
		.setStyle(TextInputStyle.Paragraph)

		const question = new ActionRowBuilder()
		.addComponents(input)

		modal.addComponents(question)

		await interaction.showModal(modal)
	}
}
// Cargar variables de entorno
require('dotenv').config();
const { Client, GatewayIntentBits, Events, SlashCommandBuilder } = require('discord.js');

// Verificar que el token existe
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ ERROR: No se encontró el token en el archivo .env");
    process.exit(1);
}

// Crear el bot con permisos adecuados
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Evento cuando el bot está listo
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Manejo de comandos de barra `/`
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply(`🏓 Pong! Latencia: ${client.ws.ping}ms`);
    }

    if (commandName === 'say') {
        const message = interaction.options.getString('mensaje');
        if (!message) return interaction.reply('Debes escribir un mensaje.');
        await interaction.reply(message);
    }

    if (commandName === 'avatar') {
        await interaction.reply(`🖼 Tu avatar: ${interaction.user.displayAvatarURL({ dynamic: true, size: 256 })}`);
    }

    if (commandName === 'serverinfo') {
        await interaction.reply(`📌 **Nombre del servidor:** ${interaction.guild.name}\n`
            + `👥 **Miembros:** ${interaction.guild.memberCount}`);
    }
});

// Iniciar sesión con el token de Discord
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log("✅ Bot de Slash Commands iniciado correctamente"))
    .catch((err) => console.error("❌ Error al iniciar sesión:", err));

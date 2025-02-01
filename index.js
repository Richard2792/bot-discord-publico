// Cargar variables de entorno desde el archivo .env
require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { exec } = require('child_process');

// Crear un servidor Express para mantener el bot activo
const app = express();

app.get("/", (req, res) => {
    res.send("¡El bot está activo y funcionando correctamente!");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express iniciado en el puerto ${PORT}`);

    // Iniciar Ngrok automáticamente para obtener una URL pública
    exec(`npx ngrok http ${PORT}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error al iniciar Ngrok: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Ngrok stderr: ${stderr}`);
            return;
        }

        // Buscar la URL pública de Ngrok en la salida
        const urlMatch = stdout.match(/https:\/\/[a-zA-Z0-9.-]+\.ngrok\.io/);
        if (urlMatch) {
            console.log(`🌍 URL pública de Ngrok: ${urlMatch[0]}`);
        } else {
            console.log("⚠️ No se pudo obtener la URL de Ngrok.");
        }
    });
});

// Verificar que el token se cargó correctamente
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ ERROR: No se encontró el token en el archivo .env");
    process.exit(1);
}

// Crear una nueva instancia del bot con los permisos adecuados
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Prefijo para comandos basados en texto
const PREFIX = 'R';

// Evento cuando el bot está listo
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Manejo de mensajes con comandos de prefijo
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return; // Ignorar mensajes de otros bots
    if (!message.content.startsWith(PREFIX)) return; // Ignorar mensajes sin prefijo

    // Separar el comando y argumentos
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // Comando de ping
    if (command === 'ping') {
        return message.reply(`🏓 Pong! Latencia: ${client.ws.ping}ms`);
    }

    // Comando para repetir mensaje
    if (command === 'say') {
        return message.channel.send(args.join(' ') || 'Debes escribir un mensaje.');
    }

    // Comando de ayuda
    if (command === 'help') {
        return message.reply("📜 **Lista de comandos:**\n"
            + "`Rping` - Ver latencia del bot\n"
            + "`Rsay <mensaje>` - Repetir un mensaje\n"
            + "`Ravatar` - Muestra tu avatar\n"
            + "`Rserverinfo` - Información del servidor");
    }

    // Comando para mostrar avatar
    if (command === 'avatar') {
        return message.reply(`🖼 Tu avatar: ${message.author.displayAvatarURL({ dynamic: true, size: 256 })}`);
    }

    // Comando para mostrar información del servidor
    if (command === 'serverinfo') {
        return message.reply(`📌 **Nombre del servidor:** ${message.guild.name}\n`
            + `👥 **Miembros:** ${message.guild.memberCount}`);
    }
});

// Manejo de comandos de barra (/)
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
    .then(() => console.log("✅ Bot iniciado correctamente"))
    .catch((err) => console.error("❌ Error al iniciar sesión:", err));

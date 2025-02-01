const express = require('express');
const app = express();
const PORT = 3000;

// Comandos del bot (puedes extraerlos desde deploy-slash-commands.js)
const commands = [
    { name: 'ping', description: 'Responde con Pong!' },
    { name: 'say', description: 'Repite un mensaje escrito' },
    { name: 'avatar', description: 'Muestra tu avatar de Discord' },
    { name: 'serverinfo', description: 'Muestra información del servidor' },
    { name: 'random', description: 'Genera un número aleatorio entre 1 y 100' }
];

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static('public'));

// Ruta para obtener la lista de comandos en formato JSON
app.get('/api/commands', (req, res) => {
    res.json(commands);
});

// Ruta principal que muestra la página con los comandos
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Comandos del Bot</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                h1 { color: #0073e6; }
                ul { list-style: none; padding: 0; }
                li { background: #f4f4f4; margin: 10px; padding: 10px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>Lista de Comandos del Bot</h1>
            <ul id="commands-list"></ul>
            <script>
                fetch('/api/commands')
                    .then(response => response.json())
                    .then(data => {
                        const commandsList = document.getElementById('commands-list');
                        data.forEach(cmd => {
                            const li = document.createElement('li');
                            li.innerHTML = '<strong>/' + cmd.name + '</strong>: ' + cmd.description;
                            commandsList.appendChild(li);
                        });
                    });
            </script>
        </body>
        </html>
    `);
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`🌐 Servidor web corriendo en: http://localhost:${PORT}`);
});

const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');

    const readEvents = (directory) => {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const fullPath = path.join(directory, file);
            if (fs.statSync(fullPath).isDirectory()) {
                readEvents(fullPath);  // Recursively read subdirectories
            } else if (file.endsWith('.js')) {
                const event = require(fullPath);

                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            }
        }
    };

    readEvents(eventsPath);
};

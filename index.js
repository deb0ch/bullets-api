
import Hapi from 'hapi';

import dbPlugin from './dbPlugin';
import Routes   from './routes';


const server = Hapi.Server({
    host: 'localhost',
    port: 3000,
    debug: {
        log: '*',
        request: '*',
    },
});

async function main() {
    try {
        server.route(Routes);
        await server.register({
            plugin: dbPlugin,
            options: {
                uri: 'mongodb://localhost/bullets-api-test',
            }
        });
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.log("SERVER ERROR: ", err);
    }
}

main().catch((err) => {
    console.log("Error at top level: ", err);
    process.exit(1);
});

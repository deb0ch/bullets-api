
import hapi                          from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import { makeExecutableSchema }      from 'graphql-tools';

import dbPlugin    from './dbPlugin';
import graphqlTask from './graphql/Task.graphql';
import resolvers   from './resolvers';
import routes      from './routes';
import Task        from './models/Task.js';


const server = hapi.Server({
    host: 'localhost',
    port: 3000,
    debug: {
        log: '*',
        request: '*',
    },
    routes: {cors: true},
});

const executableSchema = makeExecutableSchema({
    typeDefs: [graphqlTask],
    resolvers: resolvers({Task}),
});

async function main() {
    try {
        server.route(routes);
        const plugins = [
            {
                plugin: dbPlugin,
                options: {
                    uri: 'mongodb://localhost/bullets-api-test',
                }
            },
            {
                plugin: graphqlHapi,
                options: {
                    path: '/graphql',
                    graphqlOptions: () => ({
                        pretty: true,
                        schema: executableSchema,
                    }),
                },
            },
            {
                plugin: graphiqlHapi,
                options: {
                    path: '/graphiql',
                    graphiqlOptions: {
                        endpointURL: '/graphql',
                    },
                },
            },
        ];
        await server.register(plugins);
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

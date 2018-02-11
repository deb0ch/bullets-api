
import Mongoose from 'mongoose';


export default {
    name: 'db',
    register: registerDbPlugin,
}

async function registerDbPlugin(server, options) {
    try {
        await Mongoose.connect(options.uri, options.options);
    } catch (err) {
        server.log(['error', 'database', 'mongodb'],
                   'Unable to connect to MongoDB: ', err);
        process.exit(1);
    }
    Mongoose.connection.on('error', (err) => {
        server.log(['error', 'database', 'mongodb'],
                   'Unable to connect to MongoDB: ', err);
    });
    Mongoose.connection.once('open', () => {
        server.log(['info', 'database', 'mongodb'],
                   'Opened connection to MongoDB @ ', options.mongo.uri);
    });
    Mongoose.connection.on('connected', () => {
        server.log(['info', 'database', 'mongodb'],
                   'Connected to MongoDB @ ', options.mongo.uri);
    });
    Mongoose.connection.on('disconnected', () => {
        server.log(['warn', 'database', 'mongodb'],
                   'MongoDB was disconnected');
    });
}

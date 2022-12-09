import "dotenv/config";

export default {
    server: {
        port: 3000,
    },
    db: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        dbUri: process.env.MONGO_URI,
    },
    bcrypt: {
        saltRounds: 10,
    },
};

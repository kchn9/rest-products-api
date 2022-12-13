import "dotenv/config";

export default {
    server: {
        port: 3001,
    },
    db: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        dbUri: process.env.MONGO_TEST_URI,
    },
    bcrypt: {
        saltRounds: 10,
    },
    jwt: {
        privateKey: process.env.RSA_PRIVATE_KEY,
        publicKey:
            "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjbd3QYbeQZyeDnJBrCfjEEu3k\nv28W1RMS2EED4wCFfC8auUvbJHO1BtE3ckib3jwAf7rmf6uv68I/5G87KsQJRYaP\nfGSd/0Rt2/69dwZrUEBf5FxuOnv4Xb9McuDIPWWP8cRlW3CMX4gFxsAT0heirTtu\noqra/mR3h7PWb33zIQIDAQAB\n-----END PUBLIC KEY-----",
        tokenTtl: "3m",
        refreshTokenTtl: "1y",
    },
};

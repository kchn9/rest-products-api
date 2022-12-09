import pino from "pino";
import pinoPretty from "pino-pretty";
import moment from "moment";

const prettier = pinoPretty({
    colorize: true,
});

const logger = pino(
    {
        base: {
            pid: false,
        },
        timestamp: () => `,"time":"${moment().format()}"`,
    },
    prettier
);

export default logger;

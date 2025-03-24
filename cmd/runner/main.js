import { Subscriber } from "../../internal/subscriber/subscriber.js";

async function main() {
    const config = {
        server: process.env.NATS_SERVER || "nats://localhost:4222",
        topic: process.env.NATS_TOPIC || "default_runner",
        timeout: parseInt(process.env.NATS_TIMEOUT, 10) || 3000
    };

    try {
        const subscriber = new Subscriber(config);
        await subscriber.start();
    } catch (error) {
        console.error("Произошла ошибка при запуске подписчика:", error);
    }
}

main();

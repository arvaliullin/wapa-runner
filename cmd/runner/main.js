import { Subscriber } from "../../internal/subscriber/subscriber.js";

async function main() {
    const config = {
        server: "nats://localhost:4222",
        topic: "hello",
        timeout: 3000
    };

    try {
        const subscriber = new Subscriber(config);
        await subscriber.start();
    } catch (error) {
        console.error("Произошла ошибка при запуске подписчика:", error);
    }
}

main();

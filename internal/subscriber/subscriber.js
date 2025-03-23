import { connect, StringCodec } from "nats";

export class Subscriber {
    constructor(config) {
        this.server = config.server;
        this.topic = config.topic;
        this.timeout = config.timeout || 5000;
    }

    async start() {
        const nc = await this.connectWithRetry();
        const sub = nc.subscribe(this.topic);
        const sc = StringCodec();

        for await (const m of sub) {
            try {
                const task = JSON.parse(sc.decode(m.data));
                await this.executeTask(task);
            } catch (messageError) {
                console.error("Ошибка при обработке сообщения:", messageError);
            }
        }
    }

    async connectWithRetry() {
        while (true) {
            try {
                const nc = await connect({ servers: this.server });
                return nc;
            } catch (connectionError) {
                await this.sleep(this.timeout);
            }
        }
    }

    async executeTask(task) {
        console.log("Получено новое задание:", task);
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

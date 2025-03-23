import path from "path";
import { promises as fs } from "fs";
import { RunnerFactory } from "../../internal/runner/factory.js";

async function main() {
    if (process.argv.length < 4) {
        console.error("Использование: bun cmd/bench/main.js <wasm_file> <args_file>");
        process.exit(1);
    }

    const wasmFile = path.resolve(process.cwd(), process.argv[2]);
    const argsFile = path.resolve(process.cwd(), process.argv[3]);

    try {
        const argsData = JSON.parse(await fs.readFile(argsFile, "utf8"));
        const lang = argsData.lang;

        if (!lang) {
            throw new Error("Поле 'lang' отсутствует в конфигурации.");
        }

        const runner = RunnerFactory.createRunner(lang, wasmFile, argsFile);
        await runner.run();
    } catch (err) {
        console.error(`[Ошибка] ${err.message}`);
        process.exit(1);
    }
}

main();

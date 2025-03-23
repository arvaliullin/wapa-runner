import { Runner } from "./base.js";

import { Go } from "../../misc/tinygo/wasm_exec.js"

export class TinygoRunner extends Runner {
    /**
     * Загрузка модуля и выполнение функций.
     */
    async run() {
        await this.checkFileExists(this.wasmPath);
        const argsData = await this.loadJSON(this.argsPath);

        const functions = argsData.functions || [];
        if (!Array.isArray(functions) || functions.length === 0) {
            throw new Error("Массив 'functions' в JSON пуст или некорректен.");
        }

        const source = await fs.readFile(this.wasmPath);
        const typedArray = new Uint8Array(source);

        const go = new Go();
        const result = await WebAssembly.instantiate(typedArray, go.importObject);

        go.run(result.instance);

        for (let i = 0; i < functions.length; i++) {
            const func = functions[i];
            const funcName = func.function;
            const funcArgs = func.args || [];

            if (!funcName) {
                console.warn(`Функция с индексом ${i} не имеет имени. Пропуск...`);
                continue;
            }

            if (typeof globalThis[funcName] !== "function") {
                console.error(`[Ошибка] Функция '${funcName}' не найдена в глобальной области WebAssembly.`);
                continue;
            }

            await this.runFunction(i, funcName, funcArgs);
        }
    }

    /**
     * Выполнение функции из WASM.
     * @param {number} index Индекс функции
     * @param {string} funcName Имя функции
     * @param {Array} funcArgs Аргументы функции
     */
    async runFunction(index, funcName, funcArgs) {
        try {
            const start = performance.now();
            const resultValue = globalThis[funcName](...funcArgs);
            const end = performance.now();

            this.logResult(index, funcName, funcArgs, resultValue, end - start);
        } catch (err) {
            console.error(`[Ошибка] Не удалось выполнить функцию '${funcName}': ${err.message}`);
        }
    }
}

import { Runner } from "./base.js";
import { promises as fs } from "fs";

export class CppRunner extends Runner {
    async run() {
        await this.checkFileExists(this.wasmPath);
        const argsData = await this.loadJSON(this.argsPath);

        const wasmBuffer = await fs.readFile(this.wasmPath);
        const wasmModule = await WebAssembly.compile(wasmBuffer);
        const instance = await WebAssembly.instantiate(wasmModule, {});
        this.module = instance.exports;

        const functions = argsData.functions || [];
        if (!Array.isArray(functions) || functions.length === 0) {
            throw new Error("Массив 'functions' в JSON пуст или некорректен.");
        }

        for (let i = 0; i < functions.length; i++) {
            const func = functions[i];
            const funcName = func.function;
            const funcArgs = func.args || [];

            if (typeof this.module[funcName] !== "function") {
                console.warn(`[Ошибка] Функция '${funcName}' не найдена в C++ модуле.`);
                continue;
            }

            await this.runFunction(i, funcName, funcArgs);
        }
    }

    async runFunction(index, funcName, funcArgs) {
        try {
            const start = performance.now();
            const resultValue = this.module[funcName](...funcArgs);
            const end = performance.now();

            this.logResult(index, funcName, funcArgs, resultValue, end - start);
        } catch (err) {
            console.error(`[Ошибка] Не удалось выполнить функцию '${funcName}' в C++ модуле: ${err.message}`);
        }
    }
}

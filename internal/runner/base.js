import { promises as fs } from "fs";

export class Runner {
    constructor(wasmPath, argsPath) {
        this.wasmPath = wasmPath;
        this.argsPath = argsPath;
        this.module = null;
    }

    /**
     * Проверка существования файла
     * @param {string} filePath
     */
    async checkFileExists(filePath) {
        try {
            await fs.access(filePath);
        } catch (err) {
            throw new Error(`Файл не найден: ${filePath}`);
        }
    }

    /**
     * Загрузка JSON-файла.
     * @param {string} filePath
     * @returns {Promise<object>}
     */
    async loadJSON(filePath) {
        await this.checkFileExists(filePath);
        try {
            const data = await fs.readFile(filePath, "utf8");
            return JSON.parse(data);
        } catch (err) {
            throw new Error(`Ошибка чтения или парсинга JSON файла ${filePath}: ${err.message}`);
        }
    }

    /**
     * Логирование результата выполнения функции.
     * @param {number} index Индекс функции в массиве
     * @param {string} funcName Название функции
     * @param {Array} funcArgs Аргументы функции
     * @param {*} resultValue Результат выполнения
     * @param {number} execTime Время выполнения (мс)
     */
    logResult(index, funcName, funcArgs, resultValue, execTime) {
        console.log(`\n[Функция #${index}]`);
        console.log(`Имя: ${funcName}`);
        console.log(`Аргументы: ${JSON.stringify(funcArgs)}`);
        console.log(`Результат: ${resultValue}`);
        console.log(`Время выполнения: ${execTime.toFixed(2)} мс`);
    }

    async run() {
        throw new Error("Метод run() должен быть реализован в дочернем классе.");
    }
}

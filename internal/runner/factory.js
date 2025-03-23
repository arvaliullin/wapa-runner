import { GoRunner } from "./go.js";
import { RustRunner } from "./rust.js";
import { CppRunner } from "./cpp.js";

export class RunnerFactory {
    static createRunner(lang, wasmPath, argsPath) {
        switch (lang) {
            case "go":
                return new GoRunner(wasmPath, argsPath);
            case "rust":
                return new RustRunner(wasmPath, argsPath);
            case "cpp":
                return new CppRunner(wasmPath, argsPath);
            default:
                throw new Error(`Неподдерживаемый язык: ${lang}`);
        }
    }
}

/// <reference types="node" />
import { EventEmitter } from "events";
export interface ComponentDefinition {
    type?: "BOOLEAN" | "NUMBER" | "STRING";
    id: string;
    modbusAddress?: number;
    readOnly?: boolean;
    persist?: boolean;
    name?: string;
    description?: string;
    units?: string;
}
export declare class Component extends EventEmitter implements ComponentDefinition {
    type: "BOOLEAN" | "NUMBER" | "STRING";
    id: string;
    modbusAddress: number;
    readOnly: boolean;
    persist: boolean;
    name: string;
    description: string;
    units: string;
    lastUpdated: Date;
    private _value;
    value: any;
    readonly secondsSinceLastUpdate: number;
    constructor(properties: ComponentDefinition);
    serialized(): any;
}
export default class Cascade extends EventEmitter {
    private static _loops;
    private static _loopTimer;
    static components: {};
    static processes: {};
    private static _beginLoops();
    static requireProcess(processPath: string): any;
    static start(callback: () => void): void;
    static loop(callback: () => void): void;
    static addComponent(properties: ComponentDefinition): Component;
    static _processLog(level: "debug" | "info" | "warning" | "error", message: string): void;
    private static _getStoragePathForKey(key, root?);
    static storeValue(key: string, value: any, root?: string): void;
    static getStoredValue(key: string, root?: string): any;
    static logDebug(message: string): void;
    static logInfo(message: string): void;
    static logWarning(message: string): void;
    static logError(message: string): void;
}

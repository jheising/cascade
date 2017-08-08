"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const sanitize = require("sanitize-filename");
const events_1 = require("events");
class Component extends events_1.EventEmitter {
    get value() {
        return this._value;
    }
    set value(newValue) {
        let oldValue = this._value;
        if (this.type !== "STRING") {
            newValue = _.trim(newValue);
        }
        if (this.type === "NUMBER") {
            newValue = Number(newValue);
        }
        else if (this.type === "BOOLEAN") {
            newValue = (newValue === true || newValue === "true" || newValue === "1" || newValue === 1);
        }
        this._value = newValue;
        this.lastUpdated = new Date();
        this.emit("changed", newValue, oldValue);
        if (this.persist) {
            Cascade.storeValue(this.id, newValue, "persistence");
        }
    }
    get secondsSinceLastUpdate() {
        if (_.isNil(this.lastUpdated))
            return -1;
        return Math.floor((Date.now() - this.lastUpdated.getTime()) / 1000);
    }
    constructor(properties) {
        super();
        _.defaults(this, properties, {
            type: "STRING",
            id: "",
            readOnly: false,
            persist: false
        });
        if (this.persist) {
            let storedValue = Cascade.getStoredValue(this.id, "persistence");
            if (!_.isUndefined(storedValue)) {
                this.value = storedValue;
            }
        }
    }
    serialized() {
        let result = _.pick(this, ["type", "id", "modbusAddress", "readOnly", "persist", "name", "description", "units", "value", "secondsSinceLastUpdate"]);
        if (this.lastUpdated) {
            result.lastUpdated = this.lastUpdated.toISOString();
        }
        return result;
    }
}
exports.Component = Component;
class Cascade extends events_1.EventEmitter {
    static _beginLoops() {
        if (Cascade._loopTimer)
            return;
        Cascade._loopTimer = setInterval(() => {
            for (let loop of Cascade._loops) {
                loop();
            }
        }, 1000);
    }
    static requireProcess(processPath) {
        let fullPath = path.resolve(process.cwd(), processPath);
        // If the file doesn't exist, are we referring to a built-in process?
        let proc;
        try {
            proc = require(fullPath);
        }
        catch (e) {
            if (!fs.existsSync(fullPath)) {
                fullPath = path.resolve(path.join(__dirname, "processes"), processPath);
            }
            proc = require(fullPath);
        }
        if (!Cascade.processes[processPath]) {
            Cascade.processes[processPath] = proc;
            Cascade.logDebug(`Loaded process called "${path.basename(processPath)}"`);
        }
        Cascade._beginLoops();
        return Cascade.processes[processPath];
    }
    static start(callback) {
        if (callback)
            callback();
        Cascade._beginLoops();
    }
    static loop(callback) {
        Cascade._loops.push(callback);
        Cascade._beginLoops();
    }
    static addComponent(properties) {
        let newComponent = new Component(properties);
        if (Cascade.components[newComponent.id])
            throw `A component with ID "${newComponent.id}" already exists`;
        Cascade.components[newComponent.id] = newComponent;
        Cascade.logDebug(`Added a component called "${newComponent.id}"`);
        return newComponent;
    }
    static _processLog(level, message) {
        switch (level) {
            case "warning": {
                console.warn(message);
                break;
            }
            case "error": {
                console.error(message);
                break;
            }
            case "debug":
            default: {
                console.log(message);
            }
        }
    }
    static _getStoragePathForKey(key, root = "") {
        let rootPath = path.join(process.cwd(), path.join(process.env.DATA_PATH || "./data", root));
        return path.join(rootPath, sanitize(key)) + ".json";
    }
    static storeValue(key, value, root = "") {
        let keyPath = Cascade._getStoragePathForKey(key, root);
        fs.outputJsonSync(keyPath, {
            value: value
        });
    }
    static getStoredValue(key, root = "") {
        let keyPath = Cascade._getStoragePathForKey(key, root);
        try {
            let data = fs.readJsonSync(keyPath);
            return data.value;
        }
        catch (e) {
        }
    }
    static logDebug(message) {
        Cascade._processLog("debug", message);
    }
    static logInfo(message) {
        Cascade._processLog("info", message);
    }
    static logWarning(message) {
        Cascade._processLog("warning", message);
    }
    static logError(message) {
        Cascade._processLog("error", message);
    }
}
Cascade._loops = [];
Cascade.components = {};
Cascade.processes = {};
exports.default = Cascade;
if (process.env.CASCADE_PROCESSES) {
    let defaultProcesses = (process.env.CASCADE_PROCESSES).split(",");
    if (defaultProcesses.length > 0) {
        for (let defaultProcess of defaultProcesses) {
            Cascade.requireProcess(defaultProcess);
        }
    }
}
//# sourceMappingURL=Cascade.js.map
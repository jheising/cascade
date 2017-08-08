"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cascade_1 = require("./src/Cascade");
Cascade_1.default.start(() => {
    Cascade_1.default.addComponent({
        id: "run",
        type: "BOOLEAN",
        persist: true
    });
});
Cascade_1.default.loop(() => {
    console.log("Hello world");
});
//# sourceMappingURL=test.js.map
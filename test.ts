import Cascade from "./src/Cascade";

Cascade.start(() => {
    Cascade.addComponent({
        id: "run",
        type: "NUMBER",
        persist: true,
        modbusAddress: 10
    });
});

Cascade.loop(() => {
});
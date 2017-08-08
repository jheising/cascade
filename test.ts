import Cascade from "./src/Cascade";

Cascade.start(() => {
    Cascade.addComponent({
        id: "run",
        type: "BOOLEAN",
        persist: true
    });
});

Cascade.loop(() => {
    console.log("Hello world");
});
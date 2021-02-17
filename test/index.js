import Easybase from "easybasejs";
import ebconfig from "./ebconfig.js";

async function main() {
    const b = Easybase.EasybaseProvider({ ebconfig, options: { logging: true } })
    b.configureFrame({ limit: 10, offset: 0 })
    await b.sync();
    console.log(b.Frame(2));
    b.Frame(2).rating += 1.1;
    await b.sync();
    console.log(b.Frame(2));

    console.log("-----------");

    const q = await b.Query({ queryName: "my q", limit: 3 })
    console.log(q);

    const tableTypes = await b.tableTypes("table name optional");
    console.log(tableTypes);

    console.log("---------\n");

    const data = await Easybase.get({
        integrationID: "Jbw2xmrIM-ly1Inb",
        limit: 10,
        offset: 0
    });
    console.log(data);

    const res = await Easybase.callFunction("d6f217bde0b6b4d2a1d9138be901e3d8-new-hello-2", {cap: "D"});
    console.log(res);
}

main();

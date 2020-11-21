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
}

main();

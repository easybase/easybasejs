var Easybase = require("easybasejs");

async function main() {
    const b = Easybase.EasybaseProvider({ ebconfig, options: { logging: true } })
    b.configureFrame({ limit: 10, offset: 0 })
    await b.sync();
    console.log(b.Frame());
}

main();

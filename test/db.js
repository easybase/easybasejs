import Easybase from "easybasejs";
import ebconfig from "./ebconfig.js";

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;
const getMsFromHrTime = (diff) => (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS;

async function dbTest() {
    const oneTime = process.hrtime();
    const eb = Easybase.EasybaseProvider({ ebconfig });
    const e = eb.e;
    const table = eb.db("REACT TEST");

    console.log(await table.return().limit(10).all());
    console.log(await table.return(e.avg('rating')).where(e.or(
        e.lt('rating', 1),
        e.gte('rating', 40)
    )).all());
    console.log(`1 individual request: ${getMsFromHrTime(process.hrtime(oneTime))} MS`);
}

dbTest();


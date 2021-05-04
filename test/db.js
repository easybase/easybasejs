import Easybase from "easybasejs";
import ebconfig from "./ebconfig.js";

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;
const getMsFromHrTime = (diff) => (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS;

async function dbTest() {
    const oneTime = process.hrtime();
    const eb = Easybase.EasybaseProvider({ ebconfig });
    const table = eb.db('REACT TEST');
    const x = eb.dbEventListener((status, queryType, c, name) => {
        console.log("X: ", status, queryType, c, name);
    })
    const { e } = table;
    await table.insert({ "app name": 'should be zero', _position: 0 }).one();
    // console.log(await table.insert({ "app name": 'three', _position: 3 }).one())
    // await table.insert({ "app name": 'woo1', _position: 0, rating: 54 }, { "app name": 'woo2', _position: 0 }).one();
    eb.dbEventListener((status, queryType, c, name) => {
        console.log("Y: ", status, queryType, c, name)
    })
    await table.insert({ "app name": 'should be zero', _position: 0 }).all();
    x()

    // console.log(await table.return().where(e.between('rating', 0, 16)).all());
    await table.return().limit(10).all();
    console.log(`1 individual request: ${getMsFromHrTime(process.hrtime(oneTime))} MS`);
}

dbTest();


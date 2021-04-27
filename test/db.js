import Easybase from "easybasejs";
import ebconfig from "./ebconfig.js";

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;
const getMsFromHrTime = (diff) => (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS;

async function db() {
    const oneTime = process.hrtime();
    const table = Easybase.EasybaseProvider({ ebconfig }).db();
    const { e } = table;
    // console.log(await table.insert({ "app name": 'should be zero', _position: 0 }).one());
    // console.log(await table.insert({ "app name": 'three', _position: 3 }).one())
    // console.log(await table.insert({ "app name": 'woo1', _position: 0, rating: 54 }, { "app name": 'woo2', _position: 0 }).one());
    delete table.query;
    console.log(await table.return().where(e.notLike('App Name', '%2')).one());

    let page = 0;
    // let res = await table.return().limit(10).all()
    console.log(`1 individual request: ${getMsFromHrTime(process.hrtime(oneTime))} MS`);
}

db();

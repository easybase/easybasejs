import Easybase from "easybasejs";
import ebconfig from "./ebconfig.js";

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;
const getMsFromHrTime = (diff) => (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS;

async function speed() {
    const oneTime = process.hrtime();
    await Easybase.get({ integrationID: "qF354UrkJ-77Z4Hr", limit: 100 });
    console.log(`1 individual request: ${getMsFromHrTime(process.hrtime(oneTime))} MS`);

    const TEST_LENGTH = 20;
    const arrForLength = [...Array(TEST_LENGTH).keys()];

    const individualTime = process.hrtime();
    for (const _ of arrForLength) {
        await Easybase.get({ integrationID: "qF354UrkJ-77Z4Hr", limit: 100 });
    }
    console.log(`${TEST_LENGTH} individual request: ${getMsFromHrTime(process.hrtime(individualTime))} MS`);

    const parallelTime = process.hrtime();
    await Promise.all(arrForLength.map(_ => Easybase.get({ integrationID: "qF354UrkJ-77Z4Hr", limit: 100 })));
    console.log(`${TEST_LENGTH} parallel request: ${getMsFromHrTime(process.hrtime(parallelTime))} MS`);
}

speed();

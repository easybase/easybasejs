import _g from "./g";
import easyqb from 'EasyQB';
import { SQW } from "EasyQB/types/sq";
import authFactory from "./auth";
import { POST_TYPES } from "./types";

export default function dbFactory(globals?: any): { db: (tableName: string) => SQW } {
    const g = globals || _g;
    const { tokenPost } = authFactory(g);

    const allCallback = async (trx: any, tableName: String): Promise<Record<string, any>[] | number> => {
        trx.count = "all";
        trx.tableName = tableName;
        const res = await tokenPost(POST_TYPES.EASY_QB, trx);
        if (res.success) {
            return res.data;
        } else {
            return res;
        }
    }

    const oneCallback = async (trx: any, tableName: String): Promise<Record<string, any> | number> => {
        trx.count = "one";
        trx.tableName = tableName;
        const res = await tokenPost(POST_TYPES.EASY_QB, trx);
        if (res.success) {
            return res.data;
        } else {
            return res;
        }
    }

    const db = (tableName?: string) => easyqb({ allCallback, oneCallback, tableName: tableName || "untable" })(tableName || "untable");
    return { db }
}

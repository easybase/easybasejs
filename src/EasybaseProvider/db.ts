import _g from "./g";
import easyqb from 'EasyQB';
import { SQW } from "EasyQB/types/sq";
import authFactory from "./auth";
import { POST_TYPES, DB_STATUS } from "./types";



interface IdbFactory {
    db: (tableName?: string, userAssociatedRecordsOnly?: boolean) => SQW;
    dbEventListener: (callback: (status?: DB_STATUS, queryType?: string, queryCount?: string) => void) => () => void;
}

export default function dbFactory(globals?: any): IdbFactory {
    const g = globals || _g;
    const { tokenPost } = authFactory(g);

    let _listeners: ((status?: DB_STATUS, queryType?: string, queryCount?: string) => void)[] = [];

    const dbEventListener = (callback: (status?: DB_STATUS, queryType?: string, queryCount?: string) => void) => {
        _listeners.push(callback);
        return () => {
            _listeners = _listeners.filter(cb => cb !== callback)
        }
    }

    const allCallback = async (trx: any, tableName: String, userAssociatedRecordsOnly?: boolean): Promise<Record<string, any>[] | number[]> => {
        trx.count = "all";
        trx.tableName = tableName;
        if (userAssociatedRecordsOnly) trx.userAssociatedRecordsOnly = userAssociatedRecordsOnly;
        _listeners.forEach(cb => cb(DB_STATUS.PENDING, trx.type, "all"))
        const res = await tokenPost(POST_TYPES.EASY_QB, trx);
        if (res.success) {
            _listeners.forEach(cb => cb(DB_STATUS.SUCCESS, trx.type, "all"))
            return res.data;
        } else {
            _listeners.forEach(cb => cb(DB_STATUS.ERROR, trx.type, "all"))
            return res;
        }
    }

    const oneCallback = async (trx: any, tableName: String, userAssociatedRecordsOnly?: boolean): Promise<Record<string, any> | number> => {
        trx.count = "one";
        trx.tableName = tableName;
        if (userAssociatedRecordsOnly) trx.userAssociatedRecordsOnly = userAssociatedRecordsOnly;
        _listeners.forEach(cb => cb(DB_STATUS.PENDING, trx.type, "one"))
        const res = await tokenPost(POST_TYPES.EASY_QB, trx);
        if (res.success) {
            _listeners.forEach(cb => cb(DB_STATUS.SUCCESS, trx.type, "one"))
            return res.data;
        } else {
            _listeners.forEach(cb => cb(DB_STATUS.ERROR, trx.type, "one"))
            return res;
        }
    }

    const db = (tableName?: string, userAssociatedRecordsOnly?: boolean) => easyqb({ allCallback, oneCallback, userAssociatedRecordsOnly, tableName: tableName || "untable" })(tableName || "untable");
    return {
        db,
        dbEventListener
    }
}

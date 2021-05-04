import _g from "./g";
import easyqb from 'EasyQB';
import { SQW } from "EasyQB/types/sq";
import { NewExpression } from "EasyQB/types/expression";
import authFactory from "./auth";
import { POST_TYPES, DB_STATUS, Globals, EXECUTE_COUNT } from "./types";

interface IdbFactory {
    db: (tableName?: string, userAssociatedRecordsOnly?: boolean) => SQW;
    dbEventListener: (callback: (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void) => () => void;
    e: NewExpression;
}

export default function dbFactory(globals?: Globals): IdbFactory {
    const g = globals || _g;
    const { tokenPost } = authFactory(g);
    let _listenerIndex = 0;

    const _listeners: Record<string, (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void> = {};

    function _runListeners(...params) {
        for (const cb of Object.values(_listeners)) {
            cb(...params)
        }
    }

    const dbEventListener = (callback: (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void): () => void => {
        const currKey = '' + _listenerIndex++;
        _listeners[currKey] = callback;
        return () => {
            delete _listeners[currKey]
        }
    }

    const allCallback = async (trx: any, tableName: string, userAssociatedRecordsOnly?: boolean): Promise<Record<string, any>[] | number[]> => {
        trx.count = "all";
        trx.tableName = tableName;
        if (userAssociatedRecordsOnly) trx.userAssociatedRecordsOnly = userAssociatedRecordsOnly;
        _runListeners(DB_STATUS.PENDING, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null);
        const res = await tokenPost(POST_TYPES.EASY_QB, trx);
        if (res.success) {
            _runListeners(DB_STATUS.SUCCESS, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null, res.data);
            return res.data;
        } else {
            _runListeners(DB_STATUS.ERROR, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null);
            return res;
        }
    }

    const oneCallback = async (trx: any, tableName: string, userAssociatedRecordsOnly?: boolean): Promise<Record<string, any> | number> => {
        trx.count = "one";
        trx.tableName = tableName;
        if (userAssociatedRecordsOnly) trx.userAssociatedRecordsOnly = userAssociatedRecordsOnly;
        _runListeners(DB_STATUS.PENDING, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null);
        const res = await tokenPost(POST_TYPES.EASY_QB, trx);
        if (res.success) {
            _runListeners(DB_STATUS.SUCCESS, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null, res.data);
            return res.data;
        } else {
            _runListeners(DB_STATUS.ERROR, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null);
            return res;
        }
    }

    const db = (tableName?: string, userAssociatedRecordsOnly?: boolean) => {
        if (tableName && typeof tableName === "string") {
            return easyqb({ allCallback, oneCallback, userAssociatedRecordsOnly, tableName: tableName.toUpperCase() })(tableName.replace(/[^0-9a-zA-Z]/g, '_').toUpperCase());
        } else {
            return easyqb({ allCallback, oneCallback, userAssociatedRecordsOnly, tableName: "untable" })("untable");
        }
    }
    
    return {
        db,
        dbEventListener,
        e: easyqb().e
    }
}

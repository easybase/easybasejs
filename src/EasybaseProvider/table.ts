import {
    POST_TYPES,
    QueryOptions,
    Globals
} from "./types";
import _g from "./g";

import authFactory from "./auth";

export default function tableFactory(globals?: Globals): any {

    const g = globals || _g;

    const { tokenPost } = authFactory(g);

    const Query = async (options: QueryOptions): Promise<Record<string, any>[]> => {
        const defaultOptions: QueryOptions = {
            queryName: ""
        }
    
        const fullOptions: QueryOptions = { ...defaultOptions, ...options };

        const res = await tokenPost(POST_TYPES.GET_QUERY, fullOptions);
        if (res.success) {
            return res.data
        } else {
            return [];
        }
    }

    async function fullTableSize(): Promise<number>;
    async function fullTableSize(tableName: string): Promise<number>;
    async function fullTableSize(tableName?: string): Promise<number> {
        const res = await tokenPost(POST_TYPES.TABLE_SIZE, tableName ? { tableName } : {});
        if (res.success) {
            return res.data;
        } else {
            return 0;
        }
    }

    async function tableTypes(): Promise<Record<string, any>>;
    async function tableTypes(tableName: string): Promise<Record<string, any>>
    async function tableTypes(tableName?: string): Promise<Record<string, any>> {
        const res = await tokenPost(POST_TYPES.COLUMN_TYPES, tableName ? { tableName } : {});
        if (res.success) {
            return res.data;
        } else {
            return {};
        }
    }

    return {
        Query,
        fullTableSize,
        tableTypes
    };
}
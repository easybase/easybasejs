import {
    POST_TYPES,
    QueryOptions,
    Globals
} from "./types";
import _g from "./g";

import authFactory from "./auth";
import utilsFactory from "./utils";

export default function functionsFactory(globals?: Globals): any {

    const g = globals || _g;

    const { tokenPost } = authFactory(g);

    const { log } = utilsFactory(g);

    const Query = async (options: QueryOptions): Promise<Record<string, any>[]> => {
        const defaultOptions: QueryOptions = {
            queryName: ""
        }
    
        const fullOptions: QueryOptions = { ...defaultOptions, ...options };
    
        try {
            const res = await tokenPost(POST_TYPES.GET_QUERY, fullOptions);
            return res.data
        } catch (error) {
            return [];
        }
    }

    const fullTableSize = async (): Promise<number> => {
        const res = await tokenPost(POST_TYPES.TABLE_SIZE, {});
        if (res.success) {
            return res.data;
        } else {
            return 0;
        }
    }

    const tableTypes = async (): Promise<Record<string, any>> => {
        const res = await tokenPost(POST_TYPES.COLUMN_TYPES, {});
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
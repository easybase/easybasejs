import { SQW } from "EasyQB/types/sq";
import { DB_STATUS, Globals, EXECUTE_COUNT } from "./types";
interface IdbFactory {
    db: (tableName?: string, userAssociatedRecordsOnly?: boolean) => SQW;
    dbEventListener: (callback: (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void) => () => void;
}
export default function dbFactory(globals?: Globals): IdbFactory;
export {};

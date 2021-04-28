import { SQW } from "EasyQB/types/sq";
import { DB_STATUS } from "./types";
interface IdbFactory {
    db: (tableName?: string, userAssociatedRecordsOnly?: boolean) => SQW;
    dbEventListener: (callback: (status?: DB_STATUS, queryType?: string, queryCount?: string) => void) => () => void;
}
export default function dbFactory(globals?: any): IdbFactory;
export {};

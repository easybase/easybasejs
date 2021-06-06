import { SQW } from "easyqb/types/sq";
import { NewExpression } from "easyqb/types/expression";
import { DB_STATUS, Globals, EXECUTE_COUNT } from "./types";
interface IdbFactory {
    db: (tableName?: string, userAssociatedRecordsOnly?: boolean) => SQW;
    dbEventListener: (callback: (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void) => () => void;
    e: NewExpression;
}
export default function dbFactory(globals?: Globals): IdbFactory;
export {};

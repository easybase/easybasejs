import { SQW } from "easyqb/types/sq";
import { NewExpression } from "easyqb/types/expression";
import { DB_STATUS, Globals, EXECUTE_COUNT, FileFromURI, StatusResponse } from "./types";
interface IdbFactory {
    db: (tableName?: string, userAssociatedRecordsOnly?: boolean) => SQW;
    dbEventListener: (callback: (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void) => () => void;
    e: NewExpression;
    setImage(recordKey: string, columnName: string, image: File | FileFromURI, tableName?: string): Promise<StatusResponse>;
    setVideo(recordKey: string, columnName: string, video: File | FileFromURI, tableName?: string): Promise<StatusResponse>;
    setFile(recordKey: string, columnName: string, file: File | FileFromURI, tableName?: string): Promise<StatusResponse>;
}
export default function dbFactory(globals?: Globals): IdbFactory;
export {};

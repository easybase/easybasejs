import { SQW } from "EasyQB/types/sq";
export default function dbFactory(globals?: any): {
    db: (tableName: string) => SQW;
};

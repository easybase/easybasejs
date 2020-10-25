interface GetOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}
/**
 *
 * @param {GetOptions} options GetOptions.
 * @returns {Promise<Array>} Array of records.
 *
 */
export declare function get(options: GetOptions): Promise<Array<Record<string, unknown>>>;
interface PostOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, unknown>;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** If true, record will be inserted at the end of the collection rather than the front. */
    insertAtEnd?: boolean;
}
/**
 *
 * @param {PostOptions} options PostOptions
 * @returns {Promise<String>} Post status.
 *
 */
export declare function post(options: PostOptions): Promise<string>;
interface UpdateOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Values to update records with. Format is { column_name: new value } */
    updateValues: Record<string, unknown>;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}
/**
 *
 * @param {UpdateOptions} options UpdateOptions
 * @returns {Promise<String>} Update status.
 */
export declare function update(options: UpdateOptions): Promise<string>;
interface DeleteOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}
/**
 *
 * @param {DeleteOptions} options DeleteOptions
 * @return {Promise<String>} Delete status.
 */
export declare function Delete(options: DeleteOptions): Promise<string>;
export {};

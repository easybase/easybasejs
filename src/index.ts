import axios from 'axios';

const generateBareUrl = (type, integrationID) => `https://api.easybase.io/${type}/${integrationID}`;
const isBadInt = (my_int) => my_int !== undefined && my_int !== null && Math.floor(my_int) !== my_int;
const isBadString = (my_string) => my_string !== undefined && my_string !== null && typeof my_string !== "string";
const isBadIntegrationID = (my_string) => my_string === undefined || my_string === null || typeof my_string !== "string";
const isBadObject = (my_obj) => my_obj !== undefined && my_obj !== null && typeof my_obj !== "object";
const isBadBool = (my_bool) => my_bool !== undefined && my_bool !== null && typeof my_bool !== "boolean";

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
export function get(options: GetOptions): Promise<Array<Record<string, unknown>>> {
    
    const defaultOptions: GetOptions = {
        integrationID: "",
        offset: undefined,
        limit: undefined,
        authentication: undefined,
        customQuery: undefined
    }
    const { integrationID, offset, limit, authentication, customQuery } = { ...defaultOptions, ...options };

    if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
    if (isBadInt(offset)) throw new Error("offset must be an integer");
    if (isBadInt(limit)) throw new Error("limit must be an integer");
    if (isBadString(authentication)) throw new Error("authentication must be a string or null");
    if (isBadObject(customQuery)) throw new Error("customQuery must be an object or null");

    return new Promise((resolve, reject) => {
        try {
            let axios_body: any = {};
            if (typeof customQuery === "object") axios_body = { ...customQuery };
            if (offset !== undefined) axios_body.offset = offset;
            if (limit !== undefined) axios_body.limit = limit;
            if (authentication !== undefined) axios_body.authentication = authentication;

            axios.post(generateBareUrl('get', integrationID), axios_body)
                .then(res => {
                    if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                        console.error(res.data.message);
                        resolve([ res.data.message ]);
                    } else resolve(res.data);
                })
        }
        catch (err) { reject(err); }
    });
}



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
export function post(options: PostOptions): Promise<string> {

    const defaultValues: PostOptions = {
        integrationID: "",
        newRecord: undefined,
        authentication: undefined,
        insertAtEnd: undefined
    }

    const { integrationID, newRecord, authentication, insertAtEnd } = { ...defaultValues, ...options };

    if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
    if (isBadObject(newRecord)) throw new Error("newRecord is required and must be a string");
    if (isBadString(authentication)) throw new Error("authentication must be a string or null");
    if (isBadBool(insertAtEnd)) throw new Error("insertAtEnd must be a boolean or null");

    return new Promise((resolve, reject) => {
        try {
            const axios_body: any = { ...newRecord };
            if (authentication !== undefined) axios_body.authentication = authentication;
            if (insertAtEnd !== undefined) axios_body.insertAtEnd = insertAtEnd;

            axios.post(generateBareUrl('post', integrationID), axios_body)
                .then(res => {
                    if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) console.error(res.data.message);
                    resolve(res.data.message);
                })
        }
        catch (err) { reject(err); }
    });
}


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
export function update(options: UpdateOptions): Promise<string> {
    const defaultValues: UpdateOptions = {
        integrationID: "",
        updateValues: undefined,
        authentication: undefined,
        customQuery: undefined
    }

    const { integrationID, updateValues, authentication, customQuery } = { ...defaultValues, ...options };

    if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
    if (isBadObject(updateValues) || updateValues === undefined) throw new Error("updateValues is required and must be a string");
    if (isBadString(authentication)) throw new Error("authentication must be a string or null");
    if (isBadObject(customQuery)) throw new Error("customQuery must be an object or null");

    return new Promise((resolve, reject) => {
        try {
            const axios_body: any = { updateValues, ...customQuery };
            if (authentication !== undefined) axios_body.authentication = authentication;

            axios.post(generateBareUrl('update', integrationID), axios_body)
                .then(res => {
                    if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) console.error(res.data.message);
                    resolve(res.data.message);
                })
        }
        catch (err) { reject(err); }
    });
}

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
export function Delete(options: DeleteOptions): Promise<string> {

    const defaultValues: DeleteOptions = {
        integrationID: "",
        authentication: undefined,
        customQuery: undefined
    }

    const { integrationID, authentication, customQuery } = { ...defaultValues, ...options };

    if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
    if (isBadString(authentication)) throw new Error("authentication must be a string or null");
    if (isBadObject(customQuery)) throw new Error("customQuery must be an object or null");

    return new Promise((resolve, reject) => {
        try {
            const axios_body: any = { ...customQuery };
            if (authentication !== undefined) axios_body.authentication = authentication;

            axios.post(generateBareUrl('delete', integrationID), axios_body)
                .then(res => {
                    if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) console.error(res.data.message);
                    resolve(res.data.message);
                })
        }
        catch (err) { reject(err); }
    });
}

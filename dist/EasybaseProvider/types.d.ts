export interface ConfigureFrameOptions {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit?: number | null;
}
export interface EasybaseProviderPropsOptions {
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** Log Easybase react status and events to console. */
    logging?: boolean;
}
export interface EasybaseProviderProps {
    /** EasyBase ebconfig object. Can be downloaded in the integration drawer next to 'React Token'. This is automatically generated.  */
    ebconfig: Ebconfig;
    /** Optional configuration parameters. */
    options?: EasybaseProviderPropsOptions;
}
export interface FrameConfiguration {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit: number | null;
}
export interface Ebconfig {
    tt: string;
    integration: string;
    version: string;
}
export interface AddRecordOptions {
    /** If true, record will be inserted at the end of the collection rather than the front. Overwrites absoluteIndex. */
    insertAtEnd?: boolean;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, any>;
}
export interface QueryOptions {
    /** Name of the query saved in Easybase's Visual Query Builder */
    queryName: string;
    /** If you would like to sort the order of your query by a column. Pass the name of that column here */
    sortBy?: string;
    /** By default, columnToSortBy will sort your query by ascending value (1, 2, 3...). To sort by descending set this to true */
    descending?: boolean;
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. Read more: https://easybase.io/about/2020/09/15/Customizing-query-values/ */
    customQuery?: Record<string, any>;
}
export interface FileFromURI {
    /** Path on local device to the attachment. Usually received from react-native-image-picker or react-native-document-picker */
    uri: string;
    /** Name of the file with proper extension */
    name: string;
    /** File MIME type */
    type: string;
}
export interface UpdateRecordAttachmentOptions {
    /** EasyBase Record to attach this attachment to */
    record: Record<string, any>;
    /** The name of the column that is of type file/image/video */
    columnName: string;
    /** Either an HTML File element containing the correct type of attachment or a FileFromURI object for React Native instances.
     * For React Native use libraries such as react-native-image-picker and react-native-document-picker.
     * The file name must have a proper file extension corresponding to the attachment.
     */
    attachment: File | FileFromURI;
}
export interface StatusResponse {
    /** Returns true if the operation was successful */
    success: boolean;
    /** Readable description of the the operation's status */
    message: string;
    /** Will represent a corresponding error if an error was thrown during the operation. */
    error?: Error;
}
export declare enum POST_TYPES {
    UPLOAD_ATTACHMENT = "upload_attachment",
    HANDSHAKE = "handshake",
    VALID_TOKEN = "valid_token",
    GET_FRAME = "get_frame",
    TABLE_SIZE = "table_size",
    COLUMN_TYPES = "column_types",
    SYNC_STACK = "sync_stack",
    SYNC_DELETE = "sync_delete",
    SYNC_INSERT = "sync_insert",
    GET_QUERY = "get_query"
}
export interface AuthPostResponse {
    success: boolean;
    data: any;
}
export interface ContextValue {
    /**
     * Configure the current frame size. Set the offset and amount of records to retreive assume you don't want to receive
     * your entire collection. This is useful for paging.
     * @abstract
     * @param {ConfigureFrameOptions} options ConfigureFrameOptions
     * @return {StatusResponse} StatusResponse
     */
    configureFrame(options: ConfigureFrameOptions): StatusResponse;
    /**
     * Manually add a record to your collection regardless of your current frame. You must call sync() after this to see updated response.
     * @abstract
     * @async
     * @param {AddRecordOptions} options AddRecordOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    addRecord(options: AddRecordOptions): Promise<StatusResponse>;
    /**
     * Manually delete a record from your collection regardless of your current frame. You must call sync() after this to see updated response.
     * @abstract
     * @async
     * @param {Record<string, any>} record Individual Record from frame
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    deleteRecord(record: Record<string, any>): Promise<StatusResponse>;
    /**
     * Call this method to syncronize your current changes with your database. Delections, additions, and changes will all be reflected by your
     * backend after calling this method. Call Frame() after this to get a normalized array of the freshest data.
     * @abstract
     * @async
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    sync(): Promise<StatusResponse>;
    /**
     * Upload an image to your backend and attach it to a specific record. columnName must reference a column of type 'image'.
     * The file must have an extension of an image.
     * Call sync() for fresh data with propery attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordImage(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload a video to your backend and attach it to a specific record. columnName must reference a column of type 'video'.
     * The file must have an extension of a video.
     * Call sync() for fresh data with propery attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordVideo(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload a file to your backend and attach it to a specific record. columnName must reference a column of type 'file'.
     * Call sync() for fresh data with propery attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordFile(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * This function is how you access your current frame. This function does not get new data or push changes to EasyBase. If you
     * want to syncronize your frame and EasyBase, call sync() then Frame().
     * @abstract
     * @return {Record<string, any>[]} Array of records corresponding to the current frame. Call sync() to push changes that you have made to this array.
     *
     */
    Frame(): Record<string, any>[];
    /**
     * This function is how you access a single object your current frame. This function does not get new data or push changes to EasyBase. If you
     * want to syncronize your frame and EasyBase, call sync() then Frame().
     * @abstract
     * @param {number} [index] Passing an index will only return the object at that index in your Frame, rather than the entire array. This is useful for editing single objects based on an index.
     * @return {Record<string, any>} Single record corresponding to that object within the current frame. Call sync() to push changes that you have made to this object.
     *
     */
    Frame(index: number): Record<string, any>;
    /**
     * Gets the number of records in your table.
     * @async
     * @returns {Promise<number>} The the number of records in your table.
     */
    fullTableSize(): Promise<number>;
    /**
     * @async
     * Retrieve an object detailing the columns in your table mapped to their corresponding type.
     * @returns {Promise<Record<string, any>>} Object detailing the columns in your table mapped to their corresponding type.
     */
    tableTypes(): Promise<Record<string, any>>;
    /**
     * View your frames current configuration
     * @returns {Record<string, any>} Object contains the `offset` and `length` of your current frame.
     */
    currentConfiguration(): FrameConfiguration;
    /**
     * @async
     * View a query by name. This returns an isolated array that has no effect on your frame or frame configuration. sync() and Frame() have no
     * relationship with a Query(). An edited Query cannot be synced with your database, use Frame() for realtime
     * database array features.
     * @param {QueryOptions} options QueryOptions
     * @return {Promise<Record<string, any>[]>} Isolated array of records in the same form as Frame(). Editing this array has no effect and cannot be synced with your database. Use Frame() for realtime database features.
     */
    Query(options: QueryOptions): Promise<Record<string, any>[]>;
}
export interface Globals {
    ebconfig: Ebconfig;
    token: {};
    integrationID: string;
    session: number;
    options: EasybaseProviderPropsOptions;
    instance: string;
    mounted: boolean;
}

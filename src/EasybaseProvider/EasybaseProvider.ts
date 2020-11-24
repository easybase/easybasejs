import {
    EasybaseProviderProps,
    FrameConfiguration,
    POST_TYPES,
    FileFromURI,
    ContextValue,
    QueryOptions,
    AddRecordOptions,
    StatusResponse,
    ConfigureFrameOptions,
    UpdateRecordAttachmentOptions,
    AuthPostResponse
} from "./types";
import { gFactory } from "./g";
import deepEqual from "fast-deep-equal";
import { Observable } from "./object-observer";
import imageExtensions from "./assets/image-extensions.json";
import videoExtensions from "./assets/video-extensions.json";
import authFactory from "./auth";
import utilsFactory from "./utils";
import functionsFactory from "./functions";

export default function EasybaseProvider({ ebconfig, options }: EasybaseProviderProps): ContextValue {

    const g = gFactory();

    const {
        tokenPost,
        tokenPostAttachment
    } = authFactory(g);

    const {
        Query,
        fullTableSize,
        tableTypes
    } = functionsFactory(g);

    const { log } = utilsFactory(g);

    if (typeof ebconfig !== 'object' || ebconfig === null || ebconfig === undefined) {
        console.error("No ebconfig object passed. do `import ebconfig from \"ebconfig.js\"` and pass it to the Easybase provider");
        return;
    } else if (!ebconfig.integration) {
        console.error("Invalid ebconfig object passed. Download ebconfig.js from Easybase.io and try again.");
        return;
    }

    // eslint-disable-next-line dot-notation
    const isIE = typeof document !== 'undefined' && !!document['documentMode'];

    if (isIE) {
        console.error("EASYBASE — easybase-react does not support Internet Explorer. Please use a different browser.");
    }

    g.options = { ...options };
    g.integrationID = ebconfig.integration;
    g.ebconfig = ebconfig;
    g.mounted = false;
    g.instance = "Node";

    let _isFrameInitialized = true;
    let _frameConfiguration: FrameConfiguration = {
        offset: 0,
        limit: 0
    };
    const _observedChangeStack: Record<string, any>[] = [];
    let _recordIdMap: WeakMap<Record<string, any>, "string"> = new WeakMap();
    let _observableFrame = {
        observe: (_) => { },
        unobserve: () => { }
    }
    let _frame: Record<string, any>[] = [];

    let isSyncing = false;

    function Frame(): Record<string, any>[];
    function Frame(index: number): Record<string, any>;
    function Frame(index?: number): Record<string, any>[] | Record<string, any> {
        if (typeof index === "number") {
            return _observableFrame[index];
        } else {
            return _observableFrame;
        }
    }

    const _recordIDExists = (record: Record<string, any>): Boolean => !!_recordIdMap.get(record);

    const configureFrame = (options: ConfigureFrameOptions): StatusResponse => {
        if (options.limit === _frameConfiguration.limit && options.offset === _frameConfiguration.offset) {
            return {
                message: "Frame parameters are the same as the previous configuration.",
                success: true
            };
        }

        _frameConfiguration = { ..._frameConfiguration };

        if (options.limit !== undefined) _frameConfiguration.limit = options.limit;
        if (options.offset !== undefined && options.offset >= 0) _frameConfiguration.offset = options.offset;

        _isFrameInitialized = false;
        return {
            message: "Successfully configured frame. Run sync() for changes to be shown in frame",
            success: true
        }
    }

    const currentConfiguration = (): FrameConfiguration => ({ ..._frameConfiguration });

    const deleteRecord = async (record: Record<string, any> | {}): Promise<StatusResponse> => {
        const _frameRecord = _frame.find(ele => deepEqual(ele, record));

        if (_frameRecord && _recordIdMap.get(_frameRecord)) {
            const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
                _id: _recordIdMap.get(_frameRecord)
            });
            return {
                success: res.success,
                message: res.data
            }
        } else {
            try {
                const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
                    record
                });
                return {
                    success: res.success,
                    message: res.data
                }
            } catch (err) {
                console.error("Easybase Error: deleteRecord failed ", err);
                return {
                    success: false,
                    message: "Easybase Error: deleteRecord failed " + err,
                    error: err
                }
            }
        }
    }

    const addRecord = async (options: AddRecordOptions): Promise<StatusResponse> => {
        const defaultValues: AddRecordOptions = {
            insertAtEnd: false,
            newRecord: {}
        }

        const fullOptions: AddRecordOptions = { ...defaultValues, ...options };

        try {
            const res = await tokenPost(POST_TYPES.SYNC_INSERT, fullOptions);
            return {
                message: res.data,
                success: res.success
            }
        } catch (err) {
            console.error("Easybase Error: addRecord failed ", err);
            return {
                message: "Easybase Error: addRecord failed " + err,
                success: false,
                error: err
            }
        }
    }

    // Only allow the deletion of one element at a time
    // First handle shifting of the array size. Then iterate
    const sync = async (): Promise<StatusResponse> => {
        const _realignFrames = (newData: Record<string, any>[]) => {
            let isNewDataTheSame = true;

            if (newData.length !== _frame.length) {
                isNewDataTheSame = false;
            } else {
                for (let i = 0; i < newData.length; i++) {
                    const newDataNoId = { ...newData[i] };
                    delete newDataNoId._id;
                    if (!deepEqual(newDataNoId, _frame[i])) {
                        isNewDataTheSame = false;
                        break;
                    }
                }
            }

            if (!isNewDataTheSame) {
                const oldframe = [..._frame];
                oldframe.length = newData.length;
                _recordIdMap = new WeakMap();
                for (let i = 0; i < newData.length; i++) {
                    const currNewEle = newData[i];
                    _recordIdMap.set(currNewEle, currNewEle._id);
                    delete currNewEle._id;
                    oldframe[i] = currNewEle;
                }
                _frame = oldframe;
                _observableFrame.unobserve();
                _observableFrame = Observable.from(_frame);

                _observableFrame.observe((allChanges: any[]) => {
                    allChanges.forEach((change: any) => {
                        _observedChangeStack.push({
                            type: change.type,
                            path: change.path,
                            value: change.value,
                            _id: _recordIdMap.get(_frame[Number(change.path[0])])
                            // Not bringing change.object or change.oldValue
                        });
                        log(JSON.stringify({
                            type: change.type,
                            path: change.path,
                            value: change.value,
                            _id: _recordIdMap.get(_frame[Number(change.path[0])])
                            // Not bringing change.object or change.oldValue
                        }))
                    });
                });
            }
        }

        if (isSyncing) {
            return {
                success: false,
                message: "Easybase Error: the provider is currently syncing, use 'await sync()' before calling sync() again"
            };
        }

        isSyncing = true;

        const { offset, limit }: ConfigureFrameOptions = _frameConfiguration;

        if (_isFrameInitialized) {
            if (_observedChangeStack.length > 0) {
                log("Stack change: ", _observedChangeStack);
                const res = await tokenPost(POST_TYPES.SYNC_STACK, {
                    stack: _observedChangeStack,
                    limit,
                    offset
                });
                console.log(res.data);
                if (res.success) {
                    _observedChangeStack.length = 0;
                }
            }
        }

        try {
            const res = await tokenPost(POST_TYPES.GET_FRAME, {
                offset,
                limit
            });

            // Check if the array recieved from db is the same as frame
            // If not, update it and send useFrameEffect

            if (res.success === false) {
                console.error(res.data);
                isSyncing = false;
                return {
                    success: false,
                    message: "" + res.data
                }
            } else {
                _isFrameInitialized = true;
                _realignFrames(res.data);
                isSyncing = false;
                return {
                    message: 'Success. Call frame for data',
                    success: true
                }
            }
        } catch (err) {
            console.error("Easybase Error: get failed ", err);
            isSyncing = false;
            return {
                success: false,
                message: "Easybase Error: get failed " + err,
                error: err
            }
        }
    }

    const updateRecordImage = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {
        const res = await _updateRecordAttachment(options, "image");
        return res;
    }
    const updateRecordVideo = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {
        const res = await _updateRecordAttachment(options, "video");
        return res;
    }
    const updateRecordFile = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {
        const res = await _updateRecordAttachment(options, "file");
        return res;
    }

    const _updateRecordAttachment = async (options: UpdateRecordAttachmentOptions, type: string): Promise<StatusResponse> => {
        const _frameRecord: Record<string, any> | undefined = _frame.find(ele => deepEqual(ele, options.record));

        if (_frameRecord === undefined || !_recordIDExists(_frameRecord)) {
            log("Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment.");
            return {
                success: false,
                message: "Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment."
            }
        }

        const ext: string = options.attachment.name.split(".").pop()!.toLowerCase();

        log(ext);

        if (type === "image" && !imageExtensions.includes(ext)) {
            return {
                success: false,
                message: "Image files must have a proper image extension in the file name"
            };
        }

        if (type === "video" && !videoExtensions.includes(ext)) {
            return {
                success: false,
                message: "Video files must have a proper video extension in the file name"
            };
        }

        function isFileFromURI(f: File | FileFromURI): f is FileFromURI {
            return (f as FileFromURI).uri !== undefined;
        }

        const formData = new FormData();

        if (isFileFromURI(options.attachment)) {
            formData.append("file", options.attachment as any);
            formData.append("name", options.attachment.name);
        } else {
            formData.append("file", options.attachment);
            formData.append("name", options.attachment.name);
        }

        const customHeaders = {
            'Eb-upload-type': type,
            'Eb-column-name': options.columnName,
            'Eb-record-id': _recordIdMap.get(_frameRecord)
        }

        const res = await tokenPostAttachment(formData, customHeaders);

        await sync();

        return {
            message: res.data,
            success: res.success
        };
    }

    const c: ContextValue = {
        configureFrame,
        addRecord,
        deleteRecord,
        sync,
        updateRecordImage,
        updateRecordVideo,
        updateRecordFile,
        Frame,
        fullTableSize,
        tableTypes,
        currentConfiguration,
        Query
    }

    return c;

}
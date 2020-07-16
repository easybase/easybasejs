var axios = require('axios/dist/axios.min.js');
var Glide = require('@glidejs/glide/dist/glide.min.js');

const generateBareUrl = (type, integrationID) => `https://api.easybase.io/${type}/${integrationID}`;

/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {Number} offset Edit starting index from which records will be retrieved from. Useful for paging.
 * @param {Number} limit Limit the amount of records to be retrieved. Can be used in combination with offset.
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Object} customQuery This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50.
 * @returns {Array} Array of records.
 *
 */
function get(integrationID, offset, limit, authentication, customQuery) {
    if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
    if (offset !== undefined && !Number.isInteger(offset)) throw new Error("offset must be an integer");
    if (limit !== undefined && !Number.isInteger(limit)) throw new Error("limit must be an integer");
    if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
    if (customQuery !== undefined && null !== undefined && typeof customQuery !== "object") throw new Error("customQuery must be an object or null");

    return new Promise((resolve, reject) => {
        try {
            let axios_body = {};
            if (typeof customQuery === "object") axios_body = { ...axios_body, customQuery };
            if (offset !== undefined) axios_body.offset = offset;
            if (limit !== undefined) axios_body.limit = limit;
            if (authentication !== undefined) axios_body.authentication = authentication;

            axios.post(generateBareUrl('get', integrationID), axios_body)
                .then(res => {
                    resolve(res.data);
                })
        }
        catch (err) { reject(err); }
    });
}

/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {Object} newRecord Values to post to EasyBase collection. Format is { column name: value }
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Boolean} insertAtEnd If true, record will be inserted at the end of the collection rather than the front.
 */
function post(integrationID, newRecord, authentication, insertAtEnd) {
    if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
    if (newRecord === undefined || typeof newRecord !== "object") throw new Error("newRecord is required and must be a string");
    if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
    if (insertAtEnd !== undefined && insertAtEnd !== null && typeof insertAtEnd !== "boolean") throw new Error("insertAtEnd must be a boolean or null");

    return new Promise((resolve, reject) => {
        try {
            let axios_body = { ...newRecord };
            if (authentication !== undefined) axios_body.authentication = authentication;
            if (insertAtEnd !== undefined) axios_body.insertAtEnd = insertAtEnd;

            axios.post(generateBareUrl('post', integrationID), axios_body)
                .then(res => {
                    resolve(res.data.message);
                })
        }
        catch (err) { reject(err); }
    });
}

/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {Object} updateValues Values to update records with. Format is { column name: new value }
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Object} customQuery This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50.
 */
function update(integrationID, updateValues, authentication, customQuery = {}) {
    if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
    if (updateValues === undefined || typeof updateValues !== "object") throw new Error("updateValues is required and must be a string");
    if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
    if (customQuery !== undefined && null !== undefined && typeof customQuery !== "object") throw new Error("customQuery must be an object or null");

    return new Promise((resolve, reject) => {
        try {
            let axios_body = { updateValues, ...customQuery };
            if (authentication !== undefined) axios_body.authentication = authentication;

            axios.post(generateBareUrl('update', integrationID), axios_body)
                .then(res => {
                    resolve(res.data.message);
                })
        }
        catch (err) { reject(err); }
    });
}

/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Object} customQuery This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50.
 */
function Delete(integrationID, authentication, customQuery = {}) {
    if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
    if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
    if (customQuery !== undefined && null !== undefined && typeof customQuery !== "object") throw new Error("customQuery must be an object or null");

    return new Promise((resolve, reject) => {
        try {
            let axios_body = { ...customQuery };
            if (authentication !== undefined) axios_body.authentication = authentication;

            axios.post(generateBareUrl('delete', integrationID), axios_body)
                .then(res => {
                    resolve(res.data.message);
                })
        }
        catch (err) { reject(err); }
    });
}

/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {String} nodeID HTML element id to place the carousel. E.g. <div id="easybase-carousel"></div>. Carousel will be centered within the parent.
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Object} glideOptions Custom options for Glide.js carousel. Options can be found at https://glidejs.com/docs/options/. This element is highly configurable and can be tailored to your needs.
 */
function custom(integrationID, nodeID, authentication, glideOptions = {}) {
    if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
    if (nodeID === undefined || typeof nodeID !== "string") throw new Error("nodeID is required and must be a string. This is the HTML element where the elements are to be placed.");
    if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
    if (glideOptions !== undefined && glideOptions !== null && typeof glideOptions !== "object") throw new Error("glideOptions must be an object or null");

    try {
        let axios_body = {};
        if (authentication !== undefined) axios_body.authentication = authentication;

        axios.post(generateBareUrl('custom', integrationID), axios_body)
            .then(res => {
                document.getElementById(nodeID).innerHTML = res.data.html;
                var styleNode = document.createElement('style');
                styleNode.type = "text/css";
                styleNode.textContent = res.data.css;
                document.head.append(styleNode);
                new Glide('.easybase-glide', {
                    type: 'carousel',
                    perView: 4,
                    focusAt: 'center',
                    breakpoints: {
                        800: {
                            perView: 2
                        },
                        480: {
                            perView: 1
                        }
                    },
                    autoplay: 4000,
                    hoverpause: false,
                    ...glideOptions
                }).mount();

            })
    }
    catch (err) { throw new Error(err); }
}

module.exports = { get, post, update, Delete, custom };
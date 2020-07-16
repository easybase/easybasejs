(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EasyBase"] = factory();
	else
		root["EasyBase"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var axios = __webpack_require__(1);
var Glide = __webpack_require__(3);

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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/* axios v0.19.2 | (c) 2020 by Matt Zabriskie */
!function(e,t){ true?module.exports=t():undefined}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){var t=new s(e),n=i(s.prototype.request,t);return o.extend(n,s.prototype,t),o.extend(n,t),n}var o=n(2),i=n(3),s=n(4),a=n(22),u=n(10),c=r(u);c.Axios=s,c.create=function(e){return r(a(c.defaults,e))},c.Cancel=n(23),c.CancelToken=n(24),c.isCancel=n(9),c.all=function(e){return Promise.all(e)},c.spread=n(25),e.exports=c,e.exports.default=c},function(e,t,n){"use strict";function r(e){return"[object Array]"===j.call(e)}function o(e){return"undefined"==typeof e}function i(e){return null!==e&&!o(e)&&null!==e.constructor&&!o(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function s(e){return"[object ArrayBuffer]"===j.call(e)}function a(e){return"undefined"!=typeof FormData&&e instanceof FormData}function u(e){var t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function c(e){return"string"==typeof e}function f(e){return"number"==typeof e}function p(e){return null!==e&&"object"==typeof e}function d(e){return"[object Date]"===j.call(e)}function l(e){return"[object File]"===j.call(e)}function h(e){return"[object Blob]"===j.call(e)}function m(e){return"[object Function]"===j.call(e)}function y(e){return p(e)&&m(e.pipe)}function g(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function v(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function x(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)}function w(e,t){if(null!==e&&"undefined"!=typeof e)if("object"!=typeof e&&(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.call(null,e[i],i,e)}function b(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=b(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)w(arguments[n],e);return t}function E(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=E(t[n],e):"object"==typeof e?t[n]=E({},e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)w(arguments[n],e);return t}function S(e,t,n){return w(t,function(t,r){n&&"function"==typeof t?e[r]=C(t,n):e[r]=t}),e}var C=n(3),j=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:s,isBuffer:i,isFormData:a,isArrayBufferView:u,isString:c,isNumber:f,isObject:p,isUndefined:o,isDate:d,isFile:l,isBlob:h,isFunction:m,isStream:y,isURLSearchParams:g,isStandardBrowserEnv:x,forEach:w,merge:b,deepMerge:E,extend:S,trim:v}},function(e,t){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new s,response:new s}}var o=n(2),i=n(5),s=n(6),a=n(7),u=n(22);r.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{},e.url=arguments[0]):e=e||{},e=u(this.defaults,e),e.method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[a,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},r.prototype.getUri=function(e){return e=u(this.defaults,e),i(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},o.forEach(["delete","get","head","options"],function(e){r.prototype[e]=function(t,n){return this.request(o.merge(n||{},{method:e,url:t}))}}),o.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(o.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(2);e.exports=function(e,t,n){if(!t)return e;var i;if(n)i=n(t);else if(o.isURLSearchParams(t))i=t.toString();else{var s=[];o.forEach(t,function(e,t){null!==e&&"undefined"!=typeof e&&(o.isArray(e)?t+="[]":e=[e],o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),s.push(r(t)+"="+r(e))}))}),i=s.join("&")}if(i){var a=e.indexOf("#");a!==-1&&(e=e.slice(0,a)),e+=(e.indexOf("?")===-1?"?":"&")+i}return e}},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(2);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(2),i=n(8),s=n(9),a=n(10);e.exports=function(e){r(e),e.headers=e.headers||{},e.data=i(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});var t=e.adapter||a.adapter;return t(e).then(function(t){return r(e),t.data=i(t.data,t.headers,e.transformResponse),t},function(t){return s(t)||(r(e),t&&t.response&&(t.response.data=i(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,n){"use strict";function r(e,t){!i.isUndefined(e)&&i.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function o(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(12):"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process)&&(e=n(12)),e}var i=n(2),s=n(11),a={"Content-Type":"application/x-www-form-urlencoded"},u={adapter:o(),transformRequest:[function(e,t){return s(t,"Accept"),s(t,"Content-Type"),i.isFormData(e)||i.isArrayBuffer(e)||i.isBuffer(e)||i.isStream(e)||i.isFile(e)||i.isBlob(e)?e:i.isArrayBufferView(e)?e.buffer:i.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):i.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},i.forEach(["delete","get","head"],function(e){u.headers[e]={}}),i.forEach(["post","put","patch"],function(e){u.headers[e]=i.merge(a)}),e.exports=u},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(2),o=n(13),i=n(5),s=n(16),a=n(19),u=n(20),c=n(14);e.exports=function(e){return new Promise(function(t,f){var p=e.data,d=e.headers;r.isFormData(p)&&delete d["Content-Type"];var l=new XMLHttpRequest;if(e.auth){var h=e.auth.username||"",m=e.auth.password||"";d.Authorization="Basic "+btoa(h+":"+m)}var y=s(e.baseURL,e.url);if(l.open(e.method.toUpperCase(),i(y,e.params,e.paramsSerializer),!0),l.timeout=e.timeout,l.onreadystatechange=function(){if(l&&4===l.readyState&&(0!==l.status||l.responseURL&&0===l.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in l?a(l.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?l.response:l.responseText,i={data:r,status:l.status,statusText:l.statusText,headers:n,config:e,request:l};o(t,f,i),l=null}},l.onabort=function(){l&&(f(c("Request aborted",e,"ECONNABORTED",l)),l=null)},l.onerror=function(){f(c("Network Error",e,null,l)),l=null},l.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),f(c(t,e,"ECONNABORTED",l)),l=null},r.isStandardBrowserEnv()){var g=n(21),v=(e.withCredentials||u(y))&&e.xsrfCookieName?g.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in l&&r.forEach(d,function(e,t){"undefined"==typeof p&&"content-type"===t.toLowerCase()?delete d[t]:l.setRequestHeader(t,e)}),r.isUndefined(e.withCredentials)||(l.withCredentials=!!e.withCredentials),e.responseType)try{l.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&l.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&l.upload&&l.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){l&&(l.abort(),f(e),l=null)}),void 0===p&&(p=null),l.send(p)})}},function(e,t,n){"use strict";var r=n(14);e.exports=function(e,t,n){var o=n.config.validateStatus;!o||o(n.status)?e(n):t(r("Request failed with status code "+n.status,n.config,null,n.request,n))}},function(e,t,n){"use strict";var r=n(15);e.exports=function(e,t,n,o,i){var s=new Error(e);return r(s,t,n,o,i)}},function(e,t){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},function(e,t,n){"use strict";var r=n(17),o=n(18);e.exports=function(e,t){return e&&!r(t)?o(e,t):t}},function(e,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,n){"use strict";var r=n(2),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,i,s={};return e?(r.forEach(e.split("\n"),function(e){if(i=e.indexOf(":"),t=r.trim(e.substr(0,i)).toLowerCase(),n=r.trim(e.substr(i+1)),t){if(s[t]&&o.indexOf(t)>=0)return;"set-cookie"===t?s[t]=(s[t]?s[t]:[]).concat([n]):s[t]=s[t]?s[t]+", "+n:n}}),s):s}},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,i,s){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(i)&&a.push("domain="+i),s===!0&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){t=t||{};var n={},o=["url","method","params","data"],i=["headers","auth","proxy"],s=["baseURL","url","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"];r.forEach(o,function(e){"undefined"!=typeof t[e]&&(n[e]=t[e])}),r.forEach(i,function(o){r.isObject(t[o])?n[o]=r.deepMerge(e[o],t[o]):"undefined"!=typeof t[o]?n[o]=t[o]:r.isObject(e[o])?n[o]=r.deepMerge(e[o]):"undefined"!=typeof e[o]&&(n[o]=e[o])}),r.forEach(s,function(r){"undefined"!=typeof t[r]?n[r]=t[r]:"undefined"!=typeof e[r]&&(n[r]=e[r])});var a=o.concat(i).concat(s),u=Object.keys(t).filter(function(e){return a.indexOf(e)===-1});return r.forEach(u,function(r){"undefined"!=typeof t[r]?n[r]=t[r]:"undefined"!=typeof e[r]&&(n[r]=e[r])}),n}},function(e,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(23);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e,t=new r(function(t){e=t});return{token:t,cancel:e}},e.exports=r},function(e,t){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])});
//# sourceMappingURL=axios.min.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Glide.js v3.4.1
 * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
 * Released under the MIT License.
 */
!function(t,e){ true?module.exports=e():undefined}(this,function(){"use strict";var n={type:"slider",startAt:0,perView:1,focusAt:0,gap:10,autoplay:!1,hoverpause:!0,keyboard:!0,bound:!1,swipeThreshold:80,dragThreshold:120,perTouch:!1,touchRatio:.5,touchAngle:45,animationDuration:400,rewind:!0,rewindDuration:800,animationTimingFunc:"cubic-bezier(.165, .840, .440, 1)",throttle:10,direction:"ltr",peek:0,breakpoints:{},classes:{direction:{ltr:"glide--ltr",rtl:"glide--rtl"},slider:"glide--slider",carousel:"glide--carousel",swipeable:"glide--swipeable",dragging:"glide--dragging",cloneSlide:"glide__slide--clone",activeNav:"glide__bullet--active",activeSlide:"glide__slide--active",disabledArrow:"glide__arrow--disabled"}};function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t=function(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t};function o(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};function y(t){return parseInt(t)}function s(t){return"string"==typeof t}function u(t){var e=void 0===t?"undefined":r(t);return"function"===e||"object"===e&&!!t}function c(t){return"function"==typeof t}function l(t){return void 0===t}function f(t){return t.constructor===Array}function d(t,e,n){Object.defineProperty(t,e,n)}function h(t,e){var n=a({},t,e);return e.hasOwnProperty("classes")&&(n.classes=a({},t.classes,e.classes),e.classes.hasOwnProperty("direction")&&(n.classes.direction=a({},t.classes.direction,e.classes.direction))),e.hasOwnProperty("breakpoints")&&(n.breakpoints=a({},t.breakpoints,e.breakpoints)),n}var v=(t(e,[{key:"on",value:function(t,e){if(f(t))for(var n=0;n<t.length;n++)this.on(t[n],e);this.hop.call(this.events,t)||(this.events[t]=[]);var i=this.events[t].push(e)-1;return{remove:function(){delete this.events[t][i]}}}},{key:"emit",value:function(t,e){if(f(t))for(var n=0;n<t.length;n++)this.emit(t[n],e);this.hop.call(this.events,t)&&this.events[t].forEach(function(t){t(e||{})})}}]),e);function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};i(this,e),this.events=t,this.hop=t.hasOwnProperty}var p=(t(m,[{key:"mount",value:function(t){var e=0<arguments.length&&void 0!==t?t:{};return this._e.emit("mount.before"),u(e)&&(this._c=function(t,e,n){var i={};for(var r in e)c(e[r])&&(i[r]=e[r](t,i,n));for(var o in i)c(i[o].mount)&&i[o].mount();return i}(this,e,this._e)),this._e.emit("mount.after"),this}},{key:"mutate",value:function(t){var e=0<arguments.length&&void 0!==t?t:[];return f(e)&&(this._t=e),this}},{key:"update",value:function(t){var e=0<arguments.length&&void 0!==t?t:{};return this.settings=h(this.settings,e),e.hasOwnProperty("startAt")&&(this.index=e.startAt),this._e.emit("update"),this}},{key:"go",value:function(t){return this._c.Run.make(t),this}},{key:"move",value:function(t){return this._c.Transition.disable(),this._c.Move.make(t),this}},{key:"destroy",value:function(){return this._e.emit("destroy"),this}},{key:"play",value:function(t){var e=0<arguments.length&&void 0!==t&&t;return e&&(this.settings.autoplay=e),this._e.emit("play"),this}},{key:"pause",value:function(){return this._e.emit("pause"),this}},{key:"disable",value:function(){return this.disabled=!0,this}},{key:"enable",value:function(){return this.disabled=!1,this}},{key:"on",value:function(t,e){return this._e.on(t,e),this}},{key:"isType",value:function(t){return this.settings.type===t}},{key:"settings",get:function(){return this._o},set:function(t){u(t)&&(this._o=t)}},{key:"index",get:function(){return this._i},set:function(t){this._i=y(t)}},{key:"type",get:function(){return this.settings.type}},{key:"disabled",get:function(){return this._d},set:function(t){this._d=!!t}}]),m);function m(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};i(this,m),this._c={},this._t=[],this._e=new v,this.disabled=!1,this.selector=t,this.settings=h(n,e),this.index=this.settings.startAt}function g(){return(new Date).getTime()}function b(n,i,r){var o=void 0,s=void 0,u=void 0,a=void 0,c=0;r=r||{};function l(){c=!1===r.leading?0:g(),o=null,a=n.apply(s,u),o||(s=u=null)}function t(){var t=g();c||!1!==r.leading||(c=t);var e=i-(t-c);return s=this,u=arguments,e<=0||i<e?(o&&(clearTimeout(o),o=null),c=t,a=n.apply(s,u),o||(s=u=null)):o||!1===r.trailing||(o=setTimeout(l,e)),a}return t.cancel=function(){clearTimeout(o),c=0,o=s=u=null},t}var w={ltr:["marginLeft","marginRight"],rtl:["marginRight","marginLeft"]};function _(t){if(t&&t.parentNode){for(var e=t.parentNode.firstChild,n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}return[]}function k(t){return!!(t&&t instanceof window.HTMLElement)}var S='[data-glide-el="track"]';var H=(t(T,[{key:"on",value:function(t,e,n,i){var r=3<arguments.length&&void 0!==i&&i;s(t)&&(t=[t]);for(var o=0;o<t.length;o++)this.listeners[t[o]]=n,e.addEventListener(t[o],this.listeners[t[o]],r)}},{key:"off",value:function(t,e,n){var i=2<arguments.length&&void 0!==n&&n;s(t)&&(t=[t]);for(var r=0;r<t.length;r++)e.removeEventListener(t[r],this.listeners[t[r]],i)}},{key:"destroy",value:function(){delete this.listeners}}]),T);function T(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};i(this,T),this.listeners=t}var x=["ltr","rtl"],O={">":"<","<":">","=":"="};function A(t,e){return{modify:function(t){return e.Direction.is("rtl")?-t:t}}}function M(i,r,o){var s=[function(e,n){return{modify:function(t){return t+n.Gaps.value*e.index}}},function(t,e){return{modify:function(t){return t+e.Clones.grow/2}}},function(n,i){return{modify:function(t){if(0<=n.settings.focusAt){var e=i.Peek.value;return u(e)?t-e.before:t-e}return t}}},function(o,s){return{modify:function(t){var e=s.Gaps.value,n=s.Sizes.width,i=o.settings.focusAt,r=s.Sizes.slideWidth;return"center"===i?t-(n/2-r/2):t-r*i-e*i}}}].concat(i._t,[A]);return{mutate:function(t){for(var e=0;e<s.length;e++){var n=s[e];c(n)&&c(n().modify)&&(t=n(i,r,o).modify(t))}return t}}}var C=!1;try{var P=Object.defineProperty({},"passive",{get:function(){C=!0}});window.addEventListener("testPassive",null,P),window.removeEventListener("testPassive",null,P)}catch(t){}var L=C,z=["touchstart","mousedown"],j=["touchmove","mousemove"],D=["touchend","touchcancel","mouseup","mouseleave"],E=["mousedown","mousemove","mouseup","mouseleave"];function R(t){return u(t)?function(n){return Object.keys(n).sort().reduce(function(t,e){return t[e]=n[e],t[e],t},{})}(t):{}}var W={Html:function(e,t){var n={mount:function(){this.root=e.selector,this.track=this.root.querySelector(S),this.slides=Array.prototype.slice.call(this.wrapper.children).filter(function(t){return!t.classList.contains(e.settings.classes.cloneSlide)})}};return d(n,"root",{get:function(){return n._r},set:function(t){s(t)&&(t=document.querySelector(t)),k(t)&&(n._r=t)}}),d(n,"track",{get:function(){return n._t},set:function(t){k(t)&&(n._t=t)}}),d(n,"wrapper",{get:function(){return n.track.children[0]}}),n},Translate:function(r,o,s){var u={set:function(t){var e=M(r,o).mutate(t);o.Html.wrapper.style.transform="translate3d("+-1*e+"px, 0px, 0px)"},remove:function(){o.Html.wrapper.style.transform=""}};return s.on("move",function(t){var e=o.Gaps.value,n=o.Sizes.length,i=o.Sizes.slideWidth;return r.isType("carousel")&&o.Run.isOffset("<")?(o.Transition.after(function(){s.emit("translate.jump"),u.set(i*(n-1))}),u.set(-i-e*n)):r.isType("carousel")&&o.Run.isOffset(">")?(o.Transition.after(function(){s.emit("translate.jump"),u.set(0)}),u.set(i*n+e*n)):u.set(t.movement)}),s.on("destroy",function(){u.remove()}),u},Transition:function(n,i,t){var r=!1,e={compose:function(t){var e=n.settings;return r?t+" 0ms "+e.animationTimingFunc:t+" "+this.duration+"ms "+e.animationTimingFunc},set:function(t){var e=0<arguments.length&&void 0!==t?t:"transform";i.Html.wrapper.style.transition=this.compose(e)},remove:function(){i.Html.wrapper.style.transition=""},after:function(t){setTimeout(function(){t()},this.duration)},enable:function(){r=!1,this.set()},disable:function(){r=!0,this.set()}};return d(e,"duration",{get:function(){var t=n.settings;return n.isType("slider")&&i.Run.offset?t.rewindDuration:t.animationDuration}}),t.on("move",function(){e.set()}),t.on(["build.before","resize","translate.jump"],function(){e.disable()}),t.on("run",function(){e.enable()}),t.on("destroy",function(){e.remove()}),e},Direction:function(t,e,n){var i={mount:function(){this.value=t.settings.direction},resolve:function(t){var e=t.slice(0,1);return this.is("rtl")?t.split(e).join(O[e]):t},is:function(t){return this.value===t},addClass:function(){e.Html.root.classList.add(t.settings.classes.direction[this.value])},removeClass:function(){e.Html.root.classList.remove(t.settings.classes.direction[this.value])}};return d(i,"value",{get:function(){return i._v},set:function(t){-1<x.indexOf(t)&&(i._v=t)}}),n.on(["destroy","update"],function(){i.removeClass()}),n.on("update",function(){i.mount()}),n.on(["build.before","update"],function(){i.addClass()}),i},Peek:function(n,t,e){var i={mount:function(){this.value=n.settings.peek}};return d(i,"value",{get:function(){return i._v},set:function(t){u(t)?(t.before=y(t.before),t.after=y(t.after)):t=y(t),i._v=t}}),d(i,"reductor",{get:function(){var t=i.value,e=n.settings.perView;return u(t)?t.before/e+t.after/e:2*t/e}}),e.on(["resize","update"],function(){i.mount()}),i},Sizes:function(t,i,e){var n={setupSlides:function(){for(var t=this.slideWidth+"px",e=i.Html.slides,n=0;n<e.length;n++)e[n].style.width=t},setupWrapper:function(t){i.Html.wrapper.style.width=this.wrapperSize+"px"},remove:function(){for(var t=i.Html.slides,e=0;e<t.length;e++)t[e].style.width="";i.Html.wrapper.style.width=""}};return d(n,"length",{get:function(){return i.Html.slides.length}}),d(n,"width",{get:function(){return i.Html.root.offsetWidth}}),d(n,"wrapperSize",{get:function(){return n.slideWidth*n.length+i.Gaps.grow+i.Clones.grow}}),d(n,"slideWidth",{get:function(){return n.width/t.settings.perView-i.Peek.reductor-i.Gaps.reductor}}),e.on(["build.before","resize","update"],function(){n.setupSlides(),n.setupWrapper()}),e.on("destroy",function(){n.remove()}),n},Gaps:function(e,o,t){var n={apply:function(t){for(var e=0,n=t.length;e<n;e++){var i=t[e].style,r=o.Direction.value;i[w[r][0]]=0!==e?this.value/2+"px":"",e!==t.length-1?i[w[r][1]]=this.value/2+"px":i[w[r][1]]=""}},remove:function(t){for(var e=0,n=t.length;e<n;e++){var i=t[e].style;i.marginLeft="",i.marginRight=""}}};return d(n,"value",{get:function(){return y(e.settings.gap)}}),d(n,"grow",{get:function(){return n.value*(o.Sizes.length-1)}}),d(n,"reductor",{get:function(){var t=e.settings.perView;return n.value*(t-1)/t}}),t.on(["build.after","update"],b(function(){n.apply(o.Html.wrapper.children)},30)),t.on("destroy",function(){n.remove(o.Html.wrapper.children)}),n},Move:function(t,i,r){var e={mount:function(){this._o=0},make:function(t){var e=this,n=0<arguments.length&&void 0!==t?t:0;this.offset=n,r.emit("move",{movement:this.value}),i.Transition.after(function(){r.emit("move.after",{movement:e.value})})}};return d(e,"offset",{get:function(){return e._o},set:function(t){e._o=l(t)?0:y(t)}}),d(e,"translate",{get:function(){return i.Sizes.slideWidth*t.index}}),d(e,"value",{get:function(){var t=this.offset,e=this.translate;return i.Direction.is("rtl")?e+t:e-t}}),r.on(["build.before","run"],function(){e.make()}),e},Clones:function(v,p,t){var e={mount:function(){this.items=[],v.isType("carousel")&&(this.items=this.collect())},collect:function(t){for(var e=0<arguments.length&&void 0!==t?t:[],n=p.Html.slides,i=v.settings,r=i.perView,o=i.classes,s=r+ +!!v.settings.peek,u=n.slice(0,s),a=n.slice(-s),c=0;c<Math.max(1,Math.floor(r/n.length));c++){for(var l=0;l<u.length;l++){var f=u[l].cloneNode(!0);f.classList.add(o.cloneSlide),e.push(f)}for(var d=0;d<a.length;d++){var h=a[d].cloneNode(!0);h.classList.add(o.cloneSlide),e.unshift(h)}}return e},append:function(){for(var t=this.items,e=p.Html,n=e.wrapper,i=e.slides,r=Math.floor(t.length/2),o=t.slice(0,r).reverse(),s=t.slice(r,t.length),u=p.Sizes.slideWidth+"px",a=0;a<s.length;a++)n.appendChild(s[a]);for(var c=0;c<o.length;c++)n.insertBefore(o[c],i[0]);for(var l=0;l<t.length;l++)t[l].style.width=u},remove:function(){for(var t=this.items,e=0;e<t.length;e++)p.Html.wrapper.removeChild(t[e])}};return d(e,"grow",{get:function(){return(p.Sizes.slideWidth+p.Gaps.value)*e.items.length}}),t.on("update",function(){e.remove(),e.mount(),e.append()}),t.on("build.before",function(){v.isType("carousel")&&e.append()}),t.on("destroy",function(){e.remove()}),e},Resize:function(t,e,n){var i=new H,r={mount:function(){this.bind()},bind:function(){i.on("resize",window,b(function(){n.emit("resize")},t.settings.throttle))},unbind:function(){i.off("resize",window)}};return n.on("destroy",function(){r.unbind(),i.destroy()}),r},Build:function(n,i,t){var e={mount:function(){t.emit("build.before"),this.typeClass(),this.activeClass(),t.emit("build.after")},typeClass:function(){i.Html.root.classList.add(n.settings.classes[n.settings.type])},activeClass:function(){var e=n.settings.classes,t=i.Html.slides[n.index];t&&(t.classList.add(e.activeSlide),_(t).forEach(function(t){t.classList.remove(e.activeSlide)}))},removeClasses:function(){var e=n.settings.classes;i.Html.root.classList.remove(e[n.settings.type]),i.Html.slides.forEach(function(t){t.classList.remove(e.activeSlide)})}};return t.on(["destroy","update"],function(){e.removeClasses()}),t.on(["resize","update"],function(){e.mount()}),t.on("move.after",function(){e.activeClass()}),e},Run:function(o,n,i){var t={mount:function(){this._o=!1},make:function(t){var e=this;o.disabled||(o.disable(),this.move=t,i.emit("run.before",this.move),this.calculate(),i.emit("run",this.move),n.Transition.after(function(){e.isStart()&&i.emit("run.start",e.move),e.isEnd()&&i.emit("run.end",e.move),(e.isOffset("<")||e.isOffset(">"))&&(e._o=!1,i.emit("run.offset",e.move)),i.emit("run.after",e.move),o.enable()}))},calculate:function(){var t=this.move,e=this.length,n=t.steps,i=t.direction,r=function(t){return"number"==typeof t}(y(n))&&0!==y(n);switch(i){case">":">"===n?o.index=e:this.isEnd()?o.isType("slider")&&!o.settings.rewind||(this._o=!0,o.index=0):r?o.index+=Math.min(e-o.index,-y(n)):o.index++;break;case"<":"<"===n?o.index=0:this.isStart()?o.isType("slider")&&!o.settings.rewind||(this._o=!0,o.index=e):r?o.index-=Math.min(o.index,y(n)):o.index--;break;case"=":o.index=n}},isStart:function(){return 0===o.index},isEnd:function(){return o.index===this.length},isOffset:function(t){return this._o&&this.move.direction===t}};return d(t,"move",{get:function(){return this._m},set:function(t){var e=t.substr(1);this._m={direction:t.substr(0,1),steps:e?y(e)?y(e):e:0}}}),d(t,"length",{get:function(){var t=o.settings,e=n.Html.slides.length;return o.isType("slider")&&"center"!==t.focusAt&&t.bound?e-1-(y(t.perView)-1)+y(t.focusAt):e-1}}),d(t,"offset",{get:function(){return this._o}}),t},Swipe:function(d,h,v){var n=new H,p=0,m=0,g=0,i=!1,r=!!L&&{passive:!0},t={mount:function(){this.bindSwipeStart()},start:function(t){if(!i&&!d.disabled){this.disable();var e=this.touches(t);p=null,m=y(e.pageX),g=y(e.pageY),this.bindSwipeMove(),this.bindSwipeEnd(),v.emit("swipe.start")}},move:function(t){if(!d.disabled){var e=d.settings,n=e.touchAngle,i=e.touchRatio,r=e.classes,o=this.touches(t),s=y(o.pageX)-m,u=y(o.pageY)-g,a=Math.abs(s<<2),c=Math.abs(u<<2),l=Math.sqrt(a+c),f=Math.sqrt(c);if(!(180*(p=Math.asin(f/l))/Math.PI<n))return!1;t.stopPropagation(),h.Move.make(s*function(t){return parseFloat(t)}(i)),h.Html.root.classList.add(r.dragging),v.emit("swipe.move")}},end:function(t){if(!d.disabled){var e=d.settings,n=this.touches(t),i=this.threshold(t),r=n.pageX-m,o=180*p/Math.PI,s=Math.round(r/h.Sizes.slideWidth);this.enable(),i<r&&o<e.touchAngle?(e.perTouch&&(s=Math.min(s,y(e.perTouch))),h.Direction.is("rtl")&&(s=-s),h.Run.make(h.Direction.resolve("<"+s))):r<-i&&o<e.touchAngle?(e.perTouch&&(s=Math.max(s,-y(e.perTouch))),h.Direction.is("rtl")&&(s=-s),h.Run.make(h.Direction.resolve(">"+s))):h.Move.make(),h.Html.root.classList.remove(e.classes.dragging),this.unbindSwipeMove(),this.unbindSwipeEnd(),v.emit("swipe.end")}},bindSwipeStart:function(){var e=this,t=d.settings;t.swipeThreshold&&n.on(z[0],h.Html.wrapper,function(t){e.start(t)},r),t.dragThreshold&&n.on(z[1],h.Html.wrapper,function(t){e.start(t)},r)},unbindSwipeStart:function(){n.off(z[0],h.Html.wrapper,r),n.off(z[1],h.Html.wrapper,r)},bindSwipeMove:function(){var e=this;n.on(j,h.Html.wrapper,b(function(t){e.move(t)},d.settings.throttle),r)},unbindSwipeMove:function(){n.off(j,h.Html.wrapper,r)},bindSwipeEnd:function(){var e=this;n.on(D,h.Html.wrapper,function(t){e.end(t)})},unbindSwipeEnd:function(){n.off(D,h.Html.wrapper)},touches:function(t){return-1<E.indexOf(t.type)?t:t.touches[0]||t.changedTouches[0]},threshold:function(t){var e=d.settings;return-1<E.indexOf(t.type)?e.dragThreshold:e.swipeThreshold},enable:function(){return i=!1,h.Transition.enable(),this},disable:function(){return i=!0,h.Transition.disable(),this}};return v.on("build.after",function(){h.Html.root.classList.add(d.settings.classes.swipeable)}),v.on("destroy",function(){t.unbindSwipeStart(),t.unbindSwipeMove(),t.unbindSwipeEnd(),n.destroy()}),t},Images:function(t,e,n){var i=new H,r={mount:function(){this.bind()},bind:function(){i.on("dragstart",e.Html.wrapper,this.dragstart)},unbind:function(){i.off("dragstart",e.Html.wrapper)},dragstart:function(t){t.preventDefault()}};return n.on("destroy",function(){r.unbind(),i.destroy()}),r},Anchors:function(t,e,n){var i=new H,r=!1,o=!1,s={mount:function(){this._a=e.Html.wrapper.querySelectorAll("a"),this.bind()},bind:function(){i.on("click",e.Html.wrapper,this.click)},unbind:function(){i.off("click",e.Html.wrapper)},click:function(t){o&&(t.stopPropagation(),t.preventDefault())},detach:function(){if(o=!0,!r){for(var t=0;t<this.items.length;t++)this.items[t].draggable=!1,this.items[t].setAttribute("data-href",this.items[t].getAttribute("href")),this.items[t].removeAttribute("href");r=!0}return this},attach:function(){if(o=!1,r){for(var t=0;t<this.items.length;t++)this.items[t].draggable=!0,this.items[t].setAttribute("href",this.items[t].getAttribute("data-href"));r=!1}return this}};return d(s,"items",{get:function(){return s._a}}),n.on("swipe.move",function(){s.detach()}),n.on("swipe.end",function(){e.Transition.after(function(){s.attach()})}),n.on("destroy",function(){s.attach(),s.unbind(),i.destroy()}),s},Controls:function(i,e,t){var n=new H,r=!!L&&{passive:!0},o={mount:function(){this._n=e.Html.root.querySelectorAll('[data-glide-el="controls[nav]"]'),this._c=e.Html.root.querySelectorAll('[data-glide-el^="controls"]'),this.addBindings()},setActive:function(){for(var t=0;t<this._n.length;t++)this.addClass(this._n[t].children)},removeActive:function(){for(var t=0;t<this._n.length;t++)this.removeClass(this._n[t].children)},addClass:function(t){var e=i.settings,n=t[i.index];n&&(n.classList.add(e.classes.activeNav),_(n).forEach(function(t){t.classList.remove(e.classes.activeNav)}))},removeClass:function(t){var e=t[i.index];e&&e.classList.remove(i.settings.classes.activeNav)},addBindings:function(){for(var t=0;t<this._c.length;t++)this.bind(this._c[t].children)},removeBindings:function(){for(var t=0;t<this._c.length;t++)this.unbind(this._c[t].children)},bind:function(t){for(var e=0;e<t.length;e++)n.on("click",t[e],this.click),n.on("touchstart",t[e],this.click,r)},unbind:function(t){for(var e=0;e<t.length;e++)n.off(["click","touchstart"],t[e])},click:function(t){t.preventDefault(),e.Run.make(e.Direction.resolve(t.currentTarget.getAttribute("data-glide-dir")))}};return d(o,"items",{get:function(){return o._c}}),t.on(["mount.after","move.after"],function(){o.setActive()}),t.on("destroy",function(){o.removeBindings(),o.removeActive(),n.destroy()}),o},Keyboard:function(t,e,n){var i=new H,r={mount:function(){t.settings.keyboard&&this.bind()},bind:function(){i.on("keyup",document,this.press)},unbind:function(){i.off("keyup",document)},press:function(t){39===t.keyCode&&e.Run.make(e.Direction.resolve(">")),37===t.keyCode&&e.Run.make(e.Direction.resolve("<"))}};return n.on(["destroy","update"],function(){r.unbind()}),n.on("update",function(){r.mount()}),n.on("destroy",function(){i.destroy()}),r},Autoplay:function(e,n,t){var i=new H,r={mount:function(){this.start(),e.settings.hoverpause&&this.bind()},start:function(){var t=this;e.settings.autoplay&&l(this._i)&&(this._i=setInterval(function(){t.stop(),n.Run.make(">"),t.start()},this.time))},stop:function(){this._i=clearInterval(this._i)},bind:function(){var t=this;i.on("mouseover",n.Html.root,function(){t.stop()}),i.on("mouseout",n.Html.root,function(){t.start()})},unbind:function(){i.off(["mouseover","mouseout"],n.Html.root)}};return d(r,"time",{get:function(){var t=n.Html.slides[e.index].getAttribute("data-glide-autoplay");return y(t||e.settings.autoplay)}}),t.on(["destroy","update"],function(){r.unbind()}),t.on(["run.before","pause","destroy","swipe.start","update"],function(){r.stop()}),t.on(["run.after","play","swipe.end"],function(){r.start()}),t.on("update",function(){r.mount()}),t.on("destroy",function(){i.destroy()}),r},Breakpoints:function(t,e,n){var i=new H,r=t.settings,o=R(r.breakpoints),s=a({},r),u={match:function(t){if(void 0!==window.matchMedia)for(var e in t)if(t.hasOwnProperty(e)&&window.matchMedia("(max-width: "+e+"px)").matches)return t[e];return s}};return a(r,u.match(o)),i.on("resize",window,b(function(){t.settings=h(r,u.match(o))},t.settings.throttle)),n.on("update",function(){o=R(o),s=a({},r)}),n.on("destroy",function(){i.off("resize",window)}),u}};function G(){return i(this,G),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(G.__proto__||Object.getPrototypeOf(G)).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(G,p),t(G,[{key:"mount",value:function(t){var e=0<arguments.length&&void 0!==t?t:{};return function t(e,n,i){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,n);if(void 0===r){var o=Object.getPrototypeOf(e);return null===o?void 0:t(o,n,i)}if("value"in r)return r.value;var s=r.get;return void 0!==s?s.call(i):void 0}(G.prototype.__proto__||Object.getPrototypeOf(G.prototype),"mount",this).call(this,a({},W,e))}}]),G});


/***/ })
/******/ ]);
});
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.EasyBase=t():e.EasyBase=t()}(window,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=30)}([function(e,t,r){"use strict";var n=r(3),o=Object.prototype.toString;function s(e){return"[object Array]"===o.call(e)}function a(e){return void 0===e}function i(e){return null!==e&&"object"==typeof e}function c(e){return"[object Function]"===o.call(e)}function u(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),s(e))for(var r=0,n=e.length;r<n;r++)t.call(null,e[r],r,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:s,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:function(e){return null!==e&&!a(e)&&null!==e.constructor&&!a(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:i,isUndefined:a,isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:c,isStream:function(e){return i(e)&&c(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:u,merge:function e(){var t={};function r(r,n){"object"==typeof t[n]&&"object"==typeof r?t[n]=e(t[n],r):t[n]=r}for(var n=0,o=arguments.length;n<o;n++)u(arguments[n],r);return t},deepMerge:function e(){var t={};function r(r,n){"object"==typeof t[n]&&"object"==typeof r?t[n]=e(t[n],r):t[n]="object"==typeof r?e({},r):r}for(var n=0,o=arguments.length;n<o;n++)u(arguments[n],r);return t},extend:function(e,t,r){return u(t,(function(t,o){e[o]=r&&"function"==typeof t?n(t,r):t})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,t,r){e.exports=r(13)},function(e,t,r){"use strict";e.exports=function e(t,r){if(t===r)return!0;if(t&&r&&"object"==typeof t&&"object"==typeof r){if(t.constructor!==r.constructor)return!1;var n,o,s;if(Array.isArray(t)){if((n=t.length)!=r.length)return!1;for(o=n;0!=o--;)if(!e(t[o],r[o]))return!1;return!0}if(t.constructor===RegExp)return t.source===r.source&&t.flags===r.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===r.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===r.toString();if((n=(s=Object.keys(t)).length)!==Object.keys(r).length)return!1;for(o=n;0!=o--;)if(!Object.prototype.hasOwnProperty.call(r,s[o]))return!1;for(o=n;0!=o--;){var a=s[o];if(!e(t[a],r[a]))return!1}return!0}return t!=t&&r!=r}},function(e,t,r){"use strict";e.exports=function(e,t){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n];return e.apply(t,r)}}},function(e,t,r){"use strict";var n=r(0);function o(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,r){if(!t)return e;var s;if(r)s=r(t);else if(n.isURLSearchParams(t))s=t.toString();else{var a=[];n.forEach(t,(function(e,t){null!=e&&(n.isArray(e)?t+="[]":e=[e],n.forEach(e,(function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),a.push(o(t)+"="+o(e))})))})),s=a.join("&")}if(s){var i=e.indexOf("#");-1!==i&&(e=e.slice(0,i)),e+=(-1===e.indexOf("?")?"?":"&")+s}return e}},function(e,t,r){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,r){"use strict";(function(t){var n=r(0),o=r(19),s={"Content-Type":"application/x-www-form-urlencoded"};function a(e,t){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var i,c={adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==t&&"[object process]"===Object.prototype.toString.call(t))&&(i=r(7)),i),transformRequest:[function(e,t){return o(t,"Accept"),o(t,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(a(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)?(a(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],(function(e){c.headers[e]={}})),n.forEach(["post","put","patch"],(function(e){c.headers[e]=n.merge(s)})),e.exports=c}).call(this,r(18))},function(e,t,r){"use strict";var n=r(0),o=r(20),s=r(4),a=r(22),i=r(25),c=r(26),u=r(8);e.exports=function(e){return new Promise((function(t,f){var l=e.data,p=e.headers;n.isFormData(l)&&delete p["Content-Type"];var d=new XMLHttpRequest;if(e.auth){var h=e.auth.username||"",m=e.auth.password||"";p.Authorization="Basic "+btoa(h+":"+m)}var y=a(e.baseURL,e.url);if(d.open(e.method.toUpperCase(),s(y,e.params,e.paramsSerializer),!0),d.timeout=e.timeout,d.onreadystatechange=function(){if(d&&4===d.readyState&&(0!==d.status||d.responseURL&&0===d.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in d?i(d.getAllResponseHeaders()):null,n={data:e.responseType&&"text"!==e.responseType?d.response:d.responseText,status:d.status,statusText:d.statusText,headers:r,config:e,request:d};o(t,f,n),d=null}},d.onabort=function(){d&&(f(u("Request aborted",e,"ECONNABORTED",d)),d=null)},d.onerror=function(){f(u("Network Error",e,null,d)),d=null},d.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),f(u(t,e,"ECONNABORTED",d)),d=null},n.isStandardBrowserEnv()){var g=r(27),b=(e.withCredentials||c(y))&&e.xsrfCookieName?g.read(e.xsrfCookieName):void 0;b&&(p[e.xsrfHeaderName]=b)}if("setRequestHeader"in d&&n.forEach(p,(function(e,t){void 0===l&&"content-type"===t.toLowerCase()?delete p[t]:d.setRequestHeader(t,e)})),n.isUndefined(e.withCredentials)||(d.withCredentials=!!e.withCredentials),e.responseType)try{d.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&d.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&d.upload&&d.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){d&&(d.abort(),f(e),d=null)})),void 0===l&&(l=null),d.send(l)}))}},function(e,t,r){"use strict";var n=r(21);e.exports=function(e,t,r,o,s){var a=new Error(e);return n(a,t,r,o,s)}},function(e,t,r){"use strict";var n=r(0);e.exports=function(e,t){t=t||{};var r={},o=["url","method","params","data"],s=["headers","auth","proxy"],a=["baseURL","url","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"];n.forEach(o,(function(e){void 0!==t[e]&&(r[e]=t[e])})),n.forEach(s,(function(o){n.isObject(t[o])?r[o]=n.deepMerge(e[o],t[o]):void 0!==t[o]?r[o]=t[o]:n.isObject(e[o])?r[o]=n.deepMerge(e[o]):void 0!==e[o]&&(r[o]=e[o])})),n.forEach(a,(function(n){void 0!==t[n]?r[n]=t[n]:void 0!==e[n]&&(r[n]=e[n])}));var i=o.concat(s).concat(a),c=Object.keys(t).filter((function(e){return-1===i.indexOf(e)}));return n.forEach(c,(function(n){void 0!==t[n]?r[n]=t[n]:void 0!==e[n]&&(r[n]=e[n])})),r}},function(e,t,r){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e){e.exports=JSON.parse('["ase","art","bmp","blp","cd5","cit","cpt","cr2","cut","dds","dib","djvu","egt","exif","gif","gpl","grf","icns","ico","iff","jng","jpeg","jpg","jfif","jp2","jps","lbm","max","miff","mng","msp","nitf","ota","pbm","pc1","pc2","pc3","pcf","pcx","pdn","pgm","PI1","PI2","PI3","pict","pct","pnm","pns","ppm","psb","psd","pdd","psp","px","pxm","pxr","qfx","raw","rle","sct","sgi","rgb","int","bw","tga","tiff","tif","vtf","xbm","xcf","xpm","3dv","amf","ai","awg","cgm","cdr","cmx","dxf","e2d","egt","eps","fs","gbr","odg","svg","stl","vrml","x3d","sxd","v2d","vnd","wmf","emf","art","xar","png","webp","jxr","hdp","wdp","cur","ecw","iff","lbm","liff","nrrd","pam","pcx","pgf","sgi","rgb","rgba","bw","int","inta","sid","ras","sun","tga"]')},function(e){e.exports=JSON.parse('["3g2","3gp","aaf","asf","avchd","avi","drc","flv","m2v","m4p","m4v","mkv","mng","mov","mp2","mp4","mpe","mpeg","mpg","mpv","mxf","nsv","ogg","ogv","qt","rm","rmvb","roq","svi","vob","webm","wmv","yuv"]')},function(e,t,r){"use strict";var n=r(0),o=r(3),s=r(14),a=r(9);function i(e){var t=new s(e),r=o(s.prototype.request,t);return n.extend(r,s.prototype,t),n.extend(r,t),r}var c=i(r(6));c.Axios=s,c.create=function(e){return i(a(c.defaults,e))},c.Cancel=r(10),c.CancelToken=r(28),c.isCancel=r(5),c.all=function(e){return Promise.all(e)},c.spread=r(29),e.exports=c,e.exports.default=c},function(e,t,r){"use strict";var n=r(0),o=r(4),s=r(15),a=r(16),i=r(9);function c(e){this.defaults=e,this.interceptors={request:new s,response:new s}}c.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=i(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[a,void 0],r=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected)})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected)}));t.length;)r=r.then(t.shift(),t.shift());return r},c.prototype.getUri=function(e){return e=i(this.defaults,e),o(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},n.forEach(["delete","get","head","options"],(function(e){c.prototype[e]=function(t,r){return this.request(n.merge(r||{},{method:e,url:t}))}})),n.forEach(["post","put","patch"],(function(e){c.prototype[e]=function(t,r,o){return this.request(n.merge(o||{},{method:e,url:t,data:r}))}})),e.exports=c},function(e,t,r){"use strict";var n=r(0);function o(){this.handlers=[]}o.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){n.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=o},function(e,t,r){"use strict";var n=r(0),o=r(17),s=r(5),a=r(6);function i(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return i(e),e.headers=e.headers||{},e.data=o(e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),n.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||a.adapter)(e).then((function(t){return i(e),t.data=o(t.data,t.headers,e.transformResponse),t}),(function(t){return s(t)||(i(e),t&&t.response&&(t.response.data=o(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},function(e,t,r){"use strict";var n=r(0);e.exports=function(e,t,r){return n.forEach(r,(function(r){e=r(e,t)})),e}},function(e,t){var r,n,o=e.exports={};function s(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function i(e){if(r===setTimeout)return setTimeout(e,0);if((r===s||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:s}catch(e){r=s}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var c,u=[],f=!1,l=-1;function p(){f&&c&&(f=!1,c.length?u=c.concat(u):l=-1,u.length&&d())}function d(){if(!f){var e=i(p);f=!0;for(var t=u.length;t;){for(c=u,u=[];++l<t;)c&&c[l].run();l=-1,t=u.length}c=null,f=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];u.push(new h(e,t)),1!==u.length||f||i(d)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t,r){"use strict";var n=r(0);e.exports=function(e,t){n.forEach(e,(function(r,n){n!==t&&n.toUpperCase()===t.toUpperCase()&&(e[t]=r,delete e[n])}))}},function(e,t,r){"use strict";var n=r(8);e.exports=function(e,t,r){var o=r.config.validateStatus;!o||o(r.status)?e(r):t(n("Request failed with status code "+r.status,r.config,null,r.request,r))}},function(e,t,r){"use strict";e.exports=function(e,t,r,n,o){return e.config=t,r&&(e.code=r),e.request=n,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},function(e,t,r){"use strict";var n=r(23),o=r(24);e.exports=function(e,t){return e&&!n(t)?o(e,t):t}},function(e,t,r){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,r){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,r){"use strict";var n=r(0),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,r,s,a={};return e?(n.forEach(e.split("\n"),(function(e){if(s=e.indexOf(":"),t=n.trim(e.substr(0,s)).toLowerCase(),r=n.trim(e.substr(s+1)),t){if(a[t]&&o.indexOf(t)>=0)return;a[t]="set-cookie"===t?(a[t]?a[t]:[]).concat([r]):a[t]?a[t]+", "+r:r}})),a):a}},function(e,t,r){"use strict";var n=r(0);e.exports=n.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");function o(e){var n=e;return t&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return e=o(window.location.href),function(t){var r=n.isString(t)?o(t):t;return r.protocol===e.protocol&&r.host===e.host}}():function(){return!0}},function(e,t,r){"use strict";var n=r(0);e.exports=n.isStandardBrowserEnv()?{write:function(e,t,r,o,s,a){var i=[];i.push(e+"="+encodeURIComponent(t)),n.isNumber(r)&&i.push("expires="+new Date(r).toGMTString()),n.isString(o)&&i.push("path="+o),n.isString(s)&&i.push("domain="+s),!0===a&&i.push("secure"),document.cookie=i.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},function(e,t,r){"use strict";var n=r(10);function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var r=this;e((function(e){r.reason||(r.reason=new n(e),t(r.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e;return{token:new o((function(t){e=t})),cancel:e}},e.exports=o},function(e,t,r){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},function(e,t,r){"use strict";r.r(t),r.d(t,"EasybaseProvider",(function(){return I})),r.d(t,"get",(function(){return K})),r.d(t,"post",(function(){return Y})),r.d(t,"update",(function(){return H})),r.d(t,"Delete",(function(){return $}));var n,o,s=r(1),a=r.n(s);!function(e){e.UPLOAD_ATTACHMENT="upload_attachment",e.HANDSHAKE="handshake",e.VALID_TOKEN="valid_token",e.GET_FRAME="get_frame",e.TABLE_SIZE="table_size",e.COLUMN_TYPES="column_types",e.SYNC_STACK="sync_stack",e.SYNC_DELETE="sync_delete",e.SYNC_INSERT="sync_insert",e.GET_QUERY="get_query"}(n||(n={})),o||(o={});var i={...o};var c=r(2),u=r.n(c);const f=Symbol("observable-meta-key"),l={async:1},p={path:1,pathsOf:1,pathsFrom:1},d={[f]:{value:null},observe:{value:function(e,t){if("function"!=typeof e)throw new Error(`observer MUST be a function, got '${e}'`);const r=this[f].observers;if(r.some(t=>t[0]===e))console.warn("observer may be bound to an observable only once; will NOT rebind");else{let n;n=t?function(e){const t={};if(void 0!==e.path){if("string"!=typeof e.path||""===e.path)throw new Error('"path" option, if/when provided, MUST be a non-empty string');t.path=e.path}if(void 0!==e.pathsOf){if(e.path)throw new Error('"pathsOf" option MAY NOT be specified together with "path" option');if("string"!=typeof e.pathsOf)throw new Error('"pathsOf" option, if/when provided, MUST be a string (MAY be empty)');t.pathsOf=e.pathsOf.split(".").filter(e=>e)}if(void 0!==e.pathsFrom){if(e.path||e.pathsOf)throw new Error('"pathsFrom" option MAY NOT be specified together with "path"/"pathsOf"  option/s');if("string"!=typeof e.pathsFrom||""===e.pathsFrom)throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');t.pathsFrom=e.pathsFrom}const r=Object.keys(e).filter(e=>!p.hasOwnProperty(e));if(r.length)throw new Error(`'${r.join(", ")}' is/are not a valid observer option/s`);return t}(t):{},r.push([e,n])}}},unobserve:{value:function(){const e=this[f],t=e.observers;let r=t.length;if(r){let e=arguments.length;if(e)for(;e--;){let n=r;for(;n--;)t[n][0]===arguments[e]&&(t.splice(n,1),r--)}else t.splice(0)}}}},h=function(e,t){d[f].value=t;const r=Object.defineProperties({},d);for(const n of Object.keys(e))r[n]=E(e[n],n,t);return r},m=function(e,t){let r=0,n=e.length;d[f].value=t;const o=Object.defineProperties(new Array(n),d);for(;r<n;r++)o[r]=E(e[r],r,t);return o},y=function(e,t){return d[f].value=t,Object.defineProperties(e,d),e},g=function(e,t){let r=t;if(e.path){const n=e.path;r=t.filter(e=>e.path.join(".")===n)}else if(e.pathsOf){const n=e.pathsOf;r=t.filter(e=>e.path.length===n.length+1||e.path.length===n.length&&("reverse"===e.type||"shuffle"===e.type))}else if(e.pathsFrom){const n=e.pathsFrom;r=t.filter(e=>e.path.join(".").startsWith(n))}return r},b=function(e,t){try{e(t)}catch(r){console.error(`failed to notify listener ${e} with ${t}`,r)}},v=function(){const e=this.batches;this.batches=null;for(const[t,r]of e)b(t,r)},w=function(e,t){let r,n,o,s,a,i,c,u=e;const f=t.length;do{for(r=u.observers,a=r.length;a--;)if([n,o]=r[a],s=g(o,t),s.length)if(u.options.async){u.batches||(u.batches=[],queueMicrotask(v.bind(u)));let e=u.batches.find(e=>e[0]===n);e||(e=[n,[]],u.batches.push(e)),Array.prototype.push.apply(e[1],s)}else b(n,s);let e;if(u.parent){e=new Array(f);for(let r=0;r<f;r++)c=t[r],i=[u.ownKey,...c.path],e[r]={type:c.type,path:i,value:c.value,oldValue:c.oldValue,object:c.object};t=e,u=u.parent}else u=null}while(u)},E=function(e,t,r){return e&&"object"==typeof e?Array.isArray(e)?new R({target:e,ownKey:t,parent:r}).proxy:ArrayBuffer.isView(e)?new C({target:e,ownKey:t,parent:r}).proxy:e instanceof Date||e instanceof Error?e:new P({target:e,ownKey:t,parent:r}).proxy:e},x=function(){const e=this[f],t=e.target;let r,n,o;for(t.reverse(),r=0,n=t.length;r<n;r++)if(o=t[r],o&&"object"==typeof o){const e=o[f];e&&(e.ownKey=r)}return w(e,[{type:"reverse",path:[],object:this}]),this},j=function(e){const t=this[f],r=t.target;let n,o,s;for(r.sort(e),n=0,o=r.length;n<o;n++)if(s=r[n],s&&"object"==typeof s){const e=s[f];e&&(e.ownKey=n)}return w(t,[{type:"shuffle",path:[],object:this}]),this},O=function(e,t,r){const n=this[f],o=n.target,s=[],a=o.length,i=o.slice(0);if(t=void 0===t?0:t<0?Math.max(a+t,0):Math.min(t,a),r=void 0===r?a:r<0?Math.max(a+r,0):Math.min(r,a),t<a&&r>t){let a;o.fill(e,t,r);for(let e,c,u=t;u<r;u++)e=o[u],o[u]=E(e,u,n),i.hasOwnProperty(u)?(c=i[u],c&&"object"==typeof c&&(a=c[f],a&&(c=a.detach())),s.push({type:"update",path:[u],value:o[u],oldValue:c,object:this})):s.push({type:"insert",path:[u],value:o[u],object:this});w(n,s)}return this},A=function(e,t,r){const n=this[f],o=n.target,s=o.length;e=e<0?Math.max(s+e,0):e,t=void 0===t?0:t<0?Math.max(s+t,0):Math.min(t,s),r=void 0===r?s:r<0?Math.max(s+r,0):Math.min(r,s);const a=Math.min(r-t,s-e);if(e<s&&e!==t&&a>0){const s=o.slice(0),i=[];o.copyWithin(e,t,r);for(let t,r,c,u=e;u<e+a;u++)t=o[u],t&&"object"==typeof t&&(t=E(t,u,n),o[u]=t),r=s[u],r&&"object"==typeof r&&(c=r[f],c&&(r=c.detach())),"object"!=typeof t&&t===r||i.push({type:"update",path:[u],value:t,oldValue:r,object:this});w(n,i)}return this},T={pop:function(){const e=this[f],t=e.target,r=t.length-1;let n=t.pop();if(n&&"object"==typeof n){const e=n[f];e&&(n=e.detach())}return w(e,[{type:"delete",path:[r],oldValue:n,object:this}]),n},push:function(){const e=this[f],t=e.target,r=arguments.length,n=new Array(r),o=t.length;for(let t=0;t<r;t++)n[t]=E(arguments[t],o+t,e);const s=Reflect.apply(t.push,t,n),a=[];for(let e=o,r=t.length;e<r;e++)a[e-o]={type:"insert",path:[e],value:t[e],object:this};return w(e,a),s},shift:function(){const e=this[f],t=e.target;let r,n,o,s,a;for(r=t.shift(),r&&"object"==typeof r&&(a=r[f],a&&(r=a.detach())),n=0,o=t.length;n<o;n++)s=t[n],s&&"object"==typeof s&&(a=s[f],a&&(a.ownKey=n));return w(e,[{type:"delete",path:[0],oldValue:r,object:this}]),r},unshift:function(){const e=this[f],t=e.target,r=arguments.length,n=new Array(r);for(let t=0;t<r;t++)n[t]=E(arguments[t],t,e);const o=Reflect.apply(t.unshift,t,n);for(let e,r=0,n=t.length;r<n;r++)if(e=t[r],e&&"object"==typeof e){const t=e[f];t&&(t.ownKey=r)}const s=n.length,a=new Array(s);for(let e=0;e<s;e++)a[e]={type:"insert",path:[e],value:t[e],object:this};return w(e,a),o},reverse:x,sort:j,fill:O,copyWithin:A,splice:function(){const e=this[f],t=e.target,r=arguments.length,n=new Array(r),o=t.length;for(let t=0;t<r;t++)n[t]=E(arguments[t],t,e);const s=0===r?0:n[0]<0?o+n[0]:n[0],a=r<2?o-s:n[1],i=Math.max(r-2,0),c=Reflect.apply(t.splice,t,n),u=t.length;let l,p,d,h;for(let e,r=0;r<u;r++)e=t[r],e&&"object"==typeof e&&(l=e[f],l&&(l.ownKey=r));for(p=0,d=c.length;p<d;p++)h=c[p],h&&"object"==typeof h&&(l=h[f],l&&(c[p]=l.detach()));const m=[];let y;for(y=0;y<a;y++)y<i?m.push({type:"update",path:[s+y],value:t[s+y],oldValue:c[y],object:this}):m.push({type:"delete",path:[s+y],oldValue:c[y],object:this});for(;y<i;y++)m.push({type:"insert",path:[s+y],value:t[s+y],object:this});return w(e,m),c}},S={reverse:x,sort:j,fill:O,copyWithin:A,set:function(e,t){const r=this[f],n=r.target,o=e.length,s=n.slice(0);t=t||0,n.set(e,t);const a=new Array(o);for(let e=t;e<o+t;e++)a[e-t]={type:"update",path:[e],value:n[e],oldValue:s[e],object:this};w(r,a)}};class N{constructor(e,t){const{target:r,parent:n,ownKey:o}=e;n&&void 0!==o?(this.parent=n,this.ownKey=o):(this.parent=null,this.ownKey=null);const s=t(r,this);this.observers=[],this.revocable=Proxy.revocable(s,this),this.proxy=this.revocable.proxy,this.target=s,this.options=this.processOptions(e.options)}processOptions(e){if(e){if("object"!=typeof e)throw new Error(`Observable options if/when provided, MAY only be an object, got '${e}'`);const t=Object.keys(e).filter(e=>!l.hasOwnProperty(e));if(t.length)throw new Error(`'${t.join(", ")}' is/are not a valid Observable option/s`);return Object.assign({},e)}return{}}detach(){return this.parent=null,this.target}set(e,t,r){let n=e[t];if(r!==n){const o=E(r,t,this);if(e[t]=o,n&&"object"==typeof n){const e=n[f];e&&(n=e.detach())}const s=void 0===n?[{type:"insert",path:[t],value:o,object:this.proxy}]:[{type:"update",path:[t],value:o,oldValue:n,object:this.proxy}];w(this,s)}return!0}deleteProperty(e,t){let r=e[t];if(delete e[t],r&&"object"==typeof r){const e=r[f];e&&(r=e.detach())}const n=[{type:"delete",path:[t],oldValue:r,object:this.proxy}];return w(this,n),!0}}class P extends N{constructor(e){super(e,h)}}class R extends N{constructor(e){super(e,m)}get(e,t){return T.hasOwnProperty(t)?T[t]:e[t]}}class C extends N{constructor(e){super(e,y)}get(e,t){return S.hasOwnProperty(t)?S[t]:e[t]}}class k{constructor(){throw new Error('Observable MAY NOT be created via constructor, see "Observable.from" API')}static from(e,t){if(e&&"object"==typeof e){if(e[f])return e;if(Array.isArray(e))return new R({target:e,ownKey:null,parent:null,options:t}).proxy;if(ArrayBuffer.isView(e))return new C({target:e,ownKey:null,parent:null,options:t}).proxy;if(e instanceof Date||e instanceof Error)throw new Error(e+" found to be one of a on-observable types");return new P({target:e,ownKey:null,parent:null,options:t}).proxy}throw new Error("observable MAY ONLY be created from a non-null object")}static isObservable(e){return!(!e||!e[f])}}Object.freeze(k);var D=r(11),_=r(12);function M(e){const t=e||i;return{generateAuthBody:()=>{const e=Date.now();return{token:t.token,token_time:~~(t.session/(e%64)),now:e}},generateBareUrl:(e,t)=>`https://api.easybase.io/${e}/${t}`,log:function(...e){t.options.logging&&console.log("EASYBASE — ",...e)}}}function L(e){const t=e||i,{generateBareUrl:r,generateAuthBody:o,log:s}=M(t),c=async()=>{const e=Date.now();t.session=Math.floor(1e8+9e8*Math.random()),s(`Handshaking on${t.instance} instance`);const o="PROJECT"===t.ebconfig.integration.split("-")[0].toUpperCase()?"PROJECT":"REACT";try{const i=await a.a.post(r(o,t.integrationID),{version:t.ebconfig.version,tt:t.ebconfig.tt,session:t.session,instance:t.instance},{headers:{"Eb-Post-Req":n.HANDSHAKE}});if(i.data.token){t.token=i.data.token,t.mounted=!0;const r=await u(n.VALID_TOKEN),o=Date.now()-e;return!!r.success&&(s("Valid auth initiation in "+o+"ms"),!0)}return!1}catch(e){return console.error(e),!1}},u=async(e,n)=>{t.mounted||await c();const s="PROJECT"===t.ebconfig.integration.split("-")[0].toUpperCase()?"PROJECT":"REACT";try{const i=await a.a.post(r(s,t.integrationID),{_auth:o(),...n},{headers:{"Eb-Post-Req":e}});return{}.hasOwnProperty.call(i.data,"ErrorCode")||{}.hasOwnProperty.call(i.data,"code")?"JWT EXPIRED"===i.data.code?(await c(),u(e,n)):{success:!1,data:i.data.body}:{success:i.data.success,data:i.data.body}}catch(e){return{success:!1,data:e}}},f=async(e,s)=>{t.mounted||await c();const i=o(),u={"Eb-token":i.token,"Eb-token-time":i.token_time,"Eb-now":i.now};try{const o=await a.a.post(r("REACT",t.integrationID),e,{headers:{"Eb-Post-Req":n.UPLOAD_ATTACHMENT,"Content-Type":"multipart/form-data",...s,...u}});return{}.hasOwnProperty.call(o.data,"ErrorCode")||{}.hasOwnProperty.call(o.data,"code")?"JWT EXPIRED"===o.data.code?(await c(),f(e,s)):{success:!1,data:o.data.body}:{success:o.data.success,data:o.data.body}}catch(e){return{success:!1,data:e}}};return{initAuth:c,tokenPost:u,tokenPostAttachment:f}}function I({ebconfig:e,options:t}){const r={...o},{tokenPost:s,tokenPostAttachment:a}=L(r),{Query:c,fullTableSize:f,tableTypes:l}=function(e){const t=e||i,{tokenPost:r}=L(t);return{Query:async e=>{const t={queryName:"",...e};try{return(await r(n.GET_QUERY,t)).data}catch(e){return[]}},fullTableSize:async function(e){const t=await r(n.TABLE_SIZE,e?{tableName:e}:{});return t.success?t.data:0},tableTypes:async function(e){const t=await r(n.COLUMN_TYPES,e?{tableName:e}:{});return t.success?t.data:{}}}}(r),{log:p}=M(r);if("object"!=typeof e||null==e)return void console.error('No ebconfig object passed. do `import ebconfig from "ebconfig.js"` and pass it to the Easybase provider');if(!e.integration)return void console.error("Invalid ebconfig object passed. Download ebconfig.js from Easybase.io and try again.");"undefined"!=typeof document&&!!document.documentMode&&console.error("EASYBASE — easybasejs does not support Internet Explorer. Please use a different browser."),r.options={...t},r.integrationID=e.integration,r.ebconfig=e,r.mounted=!1,r.instance="Node";let d=!0,h={offset:0,limit:0};const m=[];let y=new WeakMap,g={observe:e=>{},unobserve:()=>{}},b=[],v=!1;const w=async()=>{if(v)return{success:!1,message:"Easybase Error: the provider is currently syncing, use 'await sync()' before calling sync() again"};if(v=!0,d&&m.length>0){p("Stack change: ",m);const e=await s(n.SYNC_STACK,{stack:m,...h});console.log(e.data),e.success&&(m.length=0)}try{const e=await s(n.GET_FRAME,h);return!1===e.success?(console.error(e.data),v=!1,{success:!1,message:""+e.data}):(d=!0,(e=>{let t=!0;if(e.length!==b.length)t=!1;else for(let r=0;r<e.length;r++){const n={...e[r]};if(delete n._id,!u()(n,b[r])){t=!1;break}}if(!t){const t=[...b];t.length=e.length,y=new WeakMap;for(let r=0;r<e.length;r++){const n=e[r];y.set(n,n._id),delete n._id,t[r]=n}b=t,g.unobserve(),g=k.from(b),g.observe(e=>{e.forEach(e=>{m.push({type:e.type,path:e.path,value:e.value,_id:y.get(b[Number(e.path[0])])}),p(JSON.stringify({type:e.type,path:e.path,value:e.value,_id:y.get(b[Number(e.path[0])])}))})})}})(e.data),v=!1,{message:"Success. Call frame for data",success:!0})}catch(e){return console.error("Easybase Error: get failed ",e),v=!1,{success:!1,message:"Easybase Error: get failed "+e,error:e}}},E=async(e,t)=>{const r=b.find(t=>u()(t,e.record));if(void 0===r||(n=r,!y.get(n)))return p("Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment."),{success:!1,message:"Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment."};var n;const o=e.attachment.name.split(".").pop().toLowerCase();if(p(o),"image"===t&&!D.includes(o))return{success:!1,message:"Image files must have a proper image extension in the file name"};if("video"===t&&!_.includes(o))return{success:!1,message:"Video files must have a proper video extension in the file name"};const s=new FormData;e.attachment.uri,s.append("file",e.attachment),s.append("name",e.attachment.name);const i={"Eb-upload-type":t,"Eb-column-name":e.columnName,"Eb-record-id":y.get(r),"Eb-table-name":e.tableName},c=await a(s,i);return await w(),{message:c.data,success:c.success}};return{configureFrame:e=>(h={...h},void 0!==e.limit&&(h.limit=e.limit),void 0!==e.offset&&e.offset>=0&&(h.offset=e.offset),void 0!==e.tableName&&(h.tableName=e.tableName),d=!1,{message:"Successfully configured frame. Run sync() for changes to be shown in frame",success:!0}),addRecord:async e=>{const t={insertAtEnd:!1,newRecord:{},tableName:null,...e};try{const e=await s(n.SYNC_INSERT,t);return{message:e.data,success:e.success}}catch(e){return console.error("Easybase Error: addRecord failed ",e),{message:"Easybase Error: addRecord failed "+e,success:!1,error:e}}},deleteRecord:async e=>{const t=b.find(t=>u()(t,e.record));if(t&&y.get(t)){const r=await s(n.SYNC_DELETE,{_id:y.get(t),tableName:e.tableName});return{success:r.success,message:r.data}}try{const t=await s(n.SYNC_DELETE,{record:e.record,tableName:e.tableName});return{success:t.success,message:t.data}}catch(e){return console.error("Easybase Error: deleteRecord failed ",e),{success:!1,message:"Easybase Error: deleteRecord failed "+e,error:e}}},sync:w,updateRecordImage:async e=>await E(e,"image"),updateRecordVideo:async e=>await E(e,"video"),updateRecordFile:async e=>await E(e,"file"),Frame:function(e){return"number"==typeof e?g[e]:g},fullTableSize:f,tableTypes:l,currentConfiguration:()=>({...h}),Query:c}}const U=(e,t)=>`https://api.easybase.io/${e}/${t}`,B=e=>null!=e&&Math.floor(e)!==e,q=e=>null!=e&&"string"!=typeof e,F=e=>null==e||"string"!=typeof e,V=e=>null!=e&&"object"!=typeof e;function K(e){const t={integrationID:"",offset:void 0,limit:void 0,authentication:void 0,customQuery:void 0},{integrationID:r,offset:n,limit:o,authentication:s,customQuery:i}={...t,...e};if(F(r))throw new Error("integrationID is required and must be a string");if(B(n))throw new Error("offset must be an integer");if(B(o))throw new Error("limit must be an integer");if(q(s))throw new Error("authentication must be a string or null");if(V(i))throw new Error("customQuery must be an object or null");return new Promise((e,t)=>{try{let t={};"object"==typeof i&&(t={...i}),void 0!==n&&(t.offset=n),void 0!==o&&(t.limit=o),void 0!==s&&(t.authentication=s),a.a.post(U("get",r),t).then(t=>{!{}.hasOwnProperty.call(t.data,"ErrorCode")?e(t.data):(console.error(t.data.message),e([t.data.message]))})}catch(e){t(e)}})}function Y(e){const t={integrationID:"",newRecord:void 0,authentication:void 0,insertAtEnd:void 0},{integrationID:r,newRecord:n,authentication:o,insertAtEnd:s}={...t,...e};if(F(r))throw new Error("integrationID is required and must be a string");if(V(n))throw new Error("newRecord is required and must be a string");if(q(o))throw new Error("authentication must be a string or null");if(null!=(i=s)&&"boolean"!=typeof i)throw new Error("insertAtEnd must be a boolean or null");var i;return new Promise((e,t)=>{try{const t={...n};void 0!==o&&(t.authentication=o),void 0!==s&&(t.insertAtEnd=s),a.a.post(U("post",r),t).then(t=>{({}).hasOwnProperty.call(t.data,"ErrorCode")&&console.error(t.data.message),e(t.data.message)})}catch(e){t(e)}})}function H(e){const t={integrationID:"",updateValues:void 0,authentication:void 0,customQuery:void 0},{integrationID:r,updateValues:n,authentication:o,customQuery:s}={...t,...e};if(F(r))throw new Error("integrationID is required and must be a string");if(V(n)||void 0===n)throw new Error("updateValues is required and must be a string");if(q(o))throw new Error("authentication must be a string or null");if(V(s))throw new Error("customQuery must be an object or null");return new Promise((e,t)=>{try{const t={updateValues:n,...s};void 0!==o&&(t.authentication=o),a.a.post(U("update",r),t).then(t=>{({}).hasOwnProperty.call(t.data,"ErrorCode")&&console.error(t.data.message),e(t.data.message)})}catch(e){t(e)}})}function $(e){const t={integrationID:"",authentication:void 0,customQuery:void 0},{integrationID:r,authentication:n,customQuery:o}={...t,...e};if(F(r))throw new Error("integrationID is required and must be a string");if(q(n))throw new Error("authentication must be a string or null");if(V(o))throw new Error("customQuery must be an object or null");return new Promise((e,t)=>{try{const t={...o};void 0!==n&&(t.authentication=n),a.a.post(U("delete",r),t).then(t=>{({}).hasOwnProperty.call(t.data,"ErrorCode")&&console.error(t.data.message),e(t.data.message)})}catch(e){t(e)}})}}])}));
//# sourceMappingURL=bundle.js.map
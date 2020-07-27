"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.post = post;
exports.update = update;
exports.Delete = Delete;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var generateBareUrl = function generateBareUrl(type, integrationID) {
  return "https://api.easybase.io/".concat(type, "/").concat(integrationID);
};
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
  if (customQuery !== undefined && null !== undefined && _typeof(customQuery) !== "object") throw new Error("customQuery must be an object or null");
  return new Promise(function (resolve, reject) {
    try {
      var axios_body = {};
      if (_typeof(customQuery) === "object") axios_body = _objectSpread(_objectSpread({}, axios_body), {}, {
        customQuery: customQuery
      });
      if (offset !== undefined) axios_body.offset = offset;
      if (limit !== undefined) axios_body.limit = limit;
      if (authentication !== undefined) axios_body.authentication = authentication;

      _axios["default"].post(generateBareUrl('get', integrationID), axios_body).then(function (res) {
        resolve(res.data);
      });
    } catch (err) {
      reject(err);
    }
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
  if (newRecord === undefined || _typeof(newRecord) !== "object") throw new Error("newRecord is required and must be a string");
  if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
  if (insertAtEnd !== undefined && insertAtEnd !== null && typeof insertAtEnd !== "boolean") throw new Error("insertAtEnd must be a boolean or null");
  return new Promise(function (resolve, reject) {
    try {
      var axios_body = _objectSpread({}, newRecord);

      if (authentication !== undefined) axios_body.authentication = authentication;
      if (insertAtEnd !== undefined) axios_body.insertAtEnd = insertAtEnd;

      _axios["default"].post(generateBareUrl('post', integrationID), axios_body).then(function (res) {
        resolve(res.data.message);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {Object} updateValues Values to update records with. Format is { column name: new value }
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Object} customQuery This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50.
 */


function update(integrationID, updateValues, authentication) {
  var customQuery = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
  if (updateValues === undefined || _typeof(updateValues) !== "object") throw new Error("updateValues is required and must be a string");
  if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
  if (customQuery !== undefined && null !== undefined && _typeof(customQuery) !== "object") throw new Error("customQuery must be an object or null");
  return new Promise(function (resolve, reject) {
    try {
      var axios_body = _objectSpread({
        updateValues: updateValues
      }, customQuery);

      if (authentication !== undefined) axios_body.authentication = authentication;

      _axios["default"].post(generateBareUrl('update', integrationID), axios_body).then(function (res) {
        resolve(res.data.message);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 * 
 * @param {String} integrationID EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.
 * @param {String} authentication Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility.
 * @param {Object} customQuery This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50.
 */


function Delete(integrationID, authentication) {
  var customQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (integrationID === undefined || typeof integrationID !== "string") throw new Error("integrationID is required and must be a string");
  if (authentication !== undefined && authentication !== null && typeof authentication !== "string") throw new Error("authentication must be a string or null");
  if (customQuery !== undefined && null !== undefined && _typeof(customQuery) !== "object") throw new Error("customQuery must be an object or null");
  return new Promise(function (resolve, reject) {
    try {
      var axios_body = _objectSpread({}, customQuery);

      if (authentication !== undefined) axios_body.authentication = authentication;

      _axios["default"].post(generateBareUrl('delete', integrationID), axios_body).then(function (res) {
        resolve(res.data.message);
      });
    } catch (err) {
      reject(err);
    }
  });
}
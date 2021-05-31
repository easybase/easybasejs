import fetch from 'cross-fetch';
import deepEqual from 'fast-deep-equal';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var POST_TYPES;

(function (POST_TYPES) {
  POST_TYPES["UPLOAD_ATTACHMENT"] = "upload_attachment";
  POST_TYPES["HANDSHAKE"] = "handshake";
  POST_TYPES["VALID_TOKEN"] = "valid_token";
  POST_TYPES["GET_FRAME"] = "get_frame";
  POST_TYPES["TABLE_SIZE"] = "table_size";
  POST_TYPES["COLUMN_TYPES"] = "column_types";
  POST_TYPES["SYNC_STACK"] = "sync_stack";
  POST_TYPES["SYNC_DELETE"] = "sync_delete";
  POST_TYPES["SYNC_INSERT"] = "sync_insert";
  POST_TYPES["GET_QUERY"] = "get_query";
  POST_TYPES["USER_ATTRIBUTES"] = "user_attributes";
  POST_TYPES["SET_ATTRIBUTE"] = "set_attribute";
  POST_TYPES["SIGN_UP"] = "sign_up";
  POST_TYPES["REQUEST_TOKEN"] = "request_token";
  POST_TYPES["EASY_QB"] = "easyqb";
  POST_TYPES["RESET_PASSWORD"] = "reset_password";
  POST_TYPES["FORGOT_PASSWORD_SEND"] = "forgot_password_send";
  POST_TYPES["FORGOT_PASSWORD_CONFIRM"] = "forgot_password_confirm";
})(POST_TYPES || (POST_TYPES = {}));

var DB_STATUS;

(function (DB_STATUS) {
  DB_STATUS["ERROR"] = "error";
  DB_STATUS["PENDING"] = "pending";
  DB_STATUS["SUCCESS"] = "success";
})(DB_STATUS || (DB_STATUS = {}));

var EXECUTE_COUNT;

(function (EXECUTE_COUNT) {
  EXECUTE_COUNT["ALL"] = "all";
  EXECUTE_COUNT["ONE"] = "one";
})(EXECUTE_COUNT || (EXECUTE_COUNT = {}));

var GlobalNamespace;

(function (GlobalNamespace) {})(GlobalNamespace || (GlobalNamespace = {}));

const _g = _extends({}, GlobalNamespace);
function gFactory() {
  return _extends({}, GlobalNamespace);
}

const INSERT = 'insert',
      UPDATE = 'update',
      DELETE = 'delete',
      REVERSE = 'reverse',
      SHUFFLE = 'shuffle',
      oMetaKey = Symbol('observable-meta-key'),
      validObservableOptionKeys = {
  async: 1
},
      validObserverOptionKeys = {
  path: 1,
  pathsOf: 1,
  pathsFrom: 1
},
      processObserveOptions = function processObserveOptions(options) {
  const result = {};

  if (options.path !== undefined) {
    if (typeof options.path !== 'string' || options.path === '') {
      throw new Error('"path" option, if/when provided, MUST be a non-empty string');
    }

    result.path = options.path;
  }

  if (options.pathsOf !== undefined) {
    if (options.path) {
      throw new Error('"pathsOf" option MAY NOT be specified together with "path" option');
    }

    if (typeof options.pathsOf !== 'string') {
      throw new Error('"pathsOf" option, if/when provided, MUST be a string (MAY be empty)');
    }

    result.pathsOf = options.pathsOf.split('.').filter(n => n);
  }

  if (options.pathsFrom !== undefined) {
    if (options.path || options.pathsOf) {
      throw new Error('"pathsFrom" option MAY NOT be specified together with "path"/"pathsOf"  option/s');
    }

    if (typeof options.pathsFrom !== 'string' || options.pathsFrom === '') {
      throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');
    }

    result.pathsFrom = options.pathsFrom;
  }

  const invalidOptions = Object.keys(options).filter(option => !validObserverOptionKeys.hasOwnProperty(option));

  if (invalidOptions.length) {
    throw new Error(`'${invalidOptions.join(', ')}' is/are not a valid observer option/s`);
  }

  return result;
},
      observe = function observe(observer, options) {
  if (typeof observer !== 'function') {
    throw new Error(`observer MUST be a function, got '${observer}'`);
  }

  const oMeta = this[oMetaKey],
        observers = oMeta.observers;

  if (!observers.some(o => o[0] === observer)) {
    let opts;

    if (options) {
      opts = processObserveOptions(options);
    } else {
      opts = {};
    }

    observers.push([observer, opts]);
  } else {
    console.warn('observer may be bound to an observable only once; will NOT rebind');
  }
},
      unobserve = function unobserve() {
  const oMeta = this[oMetaKey];
  const observers = oMeta.observers;
  let ol = observers.length;

  if (ol) {
    let al = arguments.length;

    if (al) {
      while (al--) {
        let i = ol;

        while (i--) {
          if (observers[i][0] === arguments[al]) {
            observers.splice(i, 1);
            ol--;
          }
        }
      }
    } else {
      observers.splice(0);
    }
  }
},
      propertiesBluePrint = {
  [oMetaKey]: {
    value: null
  },
  observe: {
    value: observe
  },
  unobserve: {
    value: unobserve
  }
},
      prepareObject = function prepareObject(source, oMeta) {
  propertiesBluePrint[oMetaKey].value = oMeta;
  const target = Object.defineProperties({}, propertiesBluePrint);

  for (const key of Object.keys(source)) {
    target[key] = getObservedOf(source[key], key, oMeta);
  }

  return target;
},
      prepareArray = function prepareArray(source, oMeta) {
  let i = 0,
      l = source.length;
  propertiesBluePrint[oMetaKey].value = oMeta;
  const target = Object.defineProperties(new Array(l), propertiesBluePrint);

  for (; i < l; i++) {
    target[i] = getObservedOf(source[i], i, oMeta);
  }

  return target;
},
      prepareTypedArray = function prepareTypedArray(source, oMeta) {
  propertiesBluePrint[oMetaKey].value = oMeta;
  Object.defineProperties(source, propertiesBluePrint);
  return source;
},
      filterChanges = function filterChanges(options, changes) {
  let result = changes;

  if (options.path) {
    const oPath = options.path;
    result = changes.filter(change => change.path.join('.') === oPath);
  } else if (options.pathsOf) {
    const oPathsOf = options.pathsOf;
    result = changes.filter(change => change.path.length === oPathsOf.length + 1 || change.path.length === oPathsOf.length && (change.type === REVERSE || change.type === SHUFFLE));
  } else if (options.pathsFrom) {
    const oPathsFrom = options.pathsFrom;
    result = changes.filter(change => change.path.join('.').startsWith(oPathsFrom));
  }

  return result;
},
      callObserverSafe = function callObserverSafe(listener, changes) {
  try {
    listener(changes);
  } catch (e) {
    console.error(`failed to notify listener ${listener} with ${changes}`, e);
  }
},
      callObserversFromMT = function callObserversFromMT() {
  const batches = this.batches;
  this.batches = null;

  for (const [listener, options] of batches) {
    callObserverSafe(listener, options);
  }
},
      callObservers = function callObservers(oMeta, changes) {
  let currentObservable = oMeta;
  let observers, target, options, relevantChanges, i, newPath, tmp;
  const l = changes.length;

  do {
    observers = currentObservable.observers;
    i = observers.length;

    while (i--) {
      [target, options] = observers[i];
      relevantChanges = filterChanges(options, changes);

      if (relevantChanges.length) {
        if (currentObservable.options.async) {
          //	this is the async dispatch handling
          if (!currentObservable.batches) {
            currentObservable.batches = [];
            queueMicrotask(callObserversFromMT.bind(currentObservable));
          }

          let rb = currentObservable.batches.find(b => b[0] === target);

          if (!rb) {
            rb = [target, []];
            currentObservable.batches.push(rb);
          }

          Array.prototype.push.apply(rb[1], relevantChanges);
        } else {
          //	this is the naive straight forward synchronous dispatch
          callObserverSafe(target, relevantChanges);
        }
      }
    }

    let tmpa;

    if (currentObservable.parent) {
      tmpa = new Array(l);

      for (let _i = 0; _i < l; _i++) {
        tmp = changes[_i];
        newPath = [currentObservable.ownKey, ...tmp.path];
        tmpa[_i] = {
          type: tmp.type,
          path: newPath,
          value: tmp.value,
          oldValue: tmp.oldValue,
          object: tmp.object
        };
      }

      changes = tmpa;
      currentObservable = currentObservable.parent;
    } else {
      currentObservable = null;
    }
  } while (currentObservable);
},
      getObservedOf = function getObservedOf(item, key, parent) {
  if (!item || typeof item !== 'object') {
    return item;
  } else if (Array.isArray(item)) {
    return new ArrayOMeta({
      target: item,
      ownKey: key,
      parent: parent
    }).proxy;
  } else if (ArrayBuffer.isView(item)) {
    return new TypedArrayOMeta({
      target: item,
      ownKey: key,
      parent: parent
    }).proxy;
  } else if (item instanceof Date || item instanceof Error) {
    return item;
  } else {
    return new ObjectOMeta({
      target: item,
      ownKey: key,
      parent: parent
    }).proxy;
  }
},
      proxiedPop = function proxiedPop() {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        poppedIndex = target.length - 1;
  let popResult = target.pop();

  if (popResult && typeof popResult === 'object') {
    const tmpObserved = popResult[oMetaKey];

    if (tmpObserved) {
      popResult = tmpObserved.detach();
    }
  }

  const changes = [{
    type: DELETE,
    path: [poppedIndex],
    oldValue: popResult,
    object: this
  }];
  callObservers(oMeta, changes);
  return popResult;
},
      proxiedPush = function proxiedPush() {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        l = arguments.length,
        pushContent = new Array(l),
        initialLength = target.length;

  for (let i = 0; i < l; i++) {
    pushContent[i] = getObservedOf(arguments[i], initialLength + i, oMeta);
  }

  const pushResult = Reflect.apply(target.push, target, pushContent);
  const changes = [];

  for (let i = initialLength, _l = target.length; i < _l; i++) {
    changes[i - initialLength] = {
      type: INSERT,
      path: [i],
      value: target[i],
      object: this
    };
  }

  callObservers(oMeta, changes);
  return pushResult;
},
      proxiedShift = function proxiedShift() {
  const oMeta = this[oMetaKey],
        target = oMeta.target;
  let shiftResult, i, l, item, tmpObserved;
  shiftResult = target.shift();

  if (shiftResult && typeof shiftResult === 'object') {
    tmpObserved = shiftResult[oMetaKey];

    if (tmpObserved) {
      shiftResult = tmpObserved.detach();
    }
  } //	update indices of the remaining items


  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];

    if (item && typeof item === 'object') {
      tmpObserved = item[oMetaKey];

      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }

  const changes = [{
    type: DELETE,
    path: [0],
    oldValue: shiftResult,
    object: this
  }];
  callObservers(oMeta, changes);
  return shiftResult;
},
      proxiedUnshift = function proxiedUnshift() {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        al = arguments.length,
        unshiftContent = new Array(al);

  for (let i = 0; i < al; i++) {
    unshiftContent[i] = getObservedOf(arguments[i], i, oMeta);
  }

  const unshiftResult = Reflect.apply(target.unshift, target, unshiftContent);

  for (let i = 0, _l2 = target.length, item; i < _l2; i++) {
    item = target[i];

    if (item && typeof item === 'object') {
      const tmpObserved = item[oMetaKey];

      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  } //	publish changes


  const l = unshiftContent.length;
  const changes = new Array(l);

  for (let i = 0; i < l; i++) {
    changes[i] = {
      type: INSERT,
      path: [i],
      value: target[i],
      object: this
    };
  }

  callObservers(oMeta, changes);
  return unshiftResult;
},
      proxiedReverse = function proxiedReverse() {
  const oMeta = this[oMetaKey],
        target = oMeta.target;
  let i, l, item;
  target.reverse();

  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];

    if (item && typeof item === 'object') {
      const tmpObserved = item[oMetaKey];

      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }

  const changes = [{
    type: REVERSE,
    path: [],
    object: this
  }];
  callObservers(oMeta, changes);
  return this;
},
      proxiedSort = function proxiedSort(comparator) {
  const oMeta = this[oMetaKey],
        target = oMeta.target;
  let i, l, item;
  target.sort(comparator);

  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];

    if (item && typeof item === 'object') {
      const tmpObserved = item[oMetaKey];

      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }

  const changes = [{
    type: SHUFFLE,
    path: [],
    object: this
  }];
  callObservers(oMeta, changes);
  return this;
},
      proxiedFill = function proxiedFill(filVal, start, end) {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        changes = [],
        tarLen = target.length,
        prev = target.slice(0);
  start = start === undefined ? 0 : start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen);
  end = end === undefined ? tarLen : end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen);

  if (start < tarLen && end > start) {
    target.fill(filVal, start, end);
    let tmpObserved;

    for (let i = start, item, tmpTarget; i < end; i++) {
      item = target[i];
      target[i] = getObservedOf(item, i, oMeta);

      if (prev.hasOwnProperty(i)) {
        tmpTarget = prev[i];

        if (tmpTarget && typeof tmpTarget === 'object') {
          tmpObserved = tmpTarget[oMetaKey];

          if (tmpObserved) {
            tmpTarget = tmpObserved.detach();
          }
        }

        changes.push({
          type: UPDATE,
          path: [i],
          value: target[i],
          oldValue: tmpTarget,
          object: this
        });
      } else {
        changes.push({
          type: INSERT,
          path: [i],
          value: target[i],
          object: this
        });
      }
    }

    callObservers(oMeta, changes);
  }

  return this;
},
      proxiedCopyWithin = function proxiedCopyWithin(dest, start, end) {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        tarLen = target.length;
  dest = dest < 0 ? Math.max(tarLen + dest, 0) : dest;
  start = start === undefined ? 0 : start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen);
  end = end === undefined ? tarLen : end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen);
  const len = Math.min(end - start, tarLen - dest);

  if (dest < tarLen && dest !== start && len > 0) {
    const prev = target.slice(0),
          changes = [];
    target.copyWithin(dest, start, end);

    for (let i = dest, nItem, oItem, tmpObserved; i < dest + len; i++) {
      //	update newly placed observables, if any
      nItem = target[i];

      if (nItem && typeof nItem === 'object') {
        nItem = getObservedOf(nItem, i, oMeta);
        target[i] = nItem;
      } //	detach overridden observables, if any


      oItem = prev[i];

      if (oItem && typeof oItem === 'object') {
        tmpObserved = oItem[oMetaKey];

        if (tmpObserved) {
          oItem = tmpObserved.detach();
        }
      }

      if (typeof nItem !== 'object' && nItem === oItem) {
        continue;
      }

      changes.push({
        type: UPDATE,
        path: [i],
        value: nItem,
        oldValue: oItem,
        object: this
      });
    }

    callObservers(oMeta, changes);
  }

  return this;
},
      proxiedSplice = function proxiedSplice() {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        splLen = arguments.length,
        spliceContent = new Array(splLen),
        tarLen = target.length; //	observify the newcomers

  for (let _i2 = 0; _i2 < splLen; _i2++) {
    spliceContent[_i2] = getObservedOf(arguments[_i2], _i2, oMeta);
  } //	calculate pointers


  const startIndex = splLen === 0 ? 0 : spliceContent[0] < 0 ? tarLen + spliceContent[0] : spliceContent[0],
        removed = splLen < 2 ? tarLen - startIndex : spliceContent[1],
        inserted = Math.max(splLen - 2, 0),
        spliceResult = Reflect.apply(target.splice, target, spliceContent),
        newTarLen = target.length; //	reindex the paths

  let tmpObserved;

  for (let _i3 = 0, _item; _i3 < newTarLen; _i3++) {
    _item = target[_i3];

    if (_item && typeof _item === 'object') {
      tmpObserved = _item[oMetaKey];

      if (tmpObserved) {
        tmpObserved.ownKey = _i3;
      }
    }
  } //	detach removed objects


  let i, l, item;

  for (i = 0, l = spliceResult.length; i < l; i++) {
    item = spliceResult[i];

    if (item && typeof item === 'object') {
      tmpObserved = item[oMetaKey];

      if (tmpObserved) {
        spliceResult[i] = tmpObserved.detach();
      }
    }
  }

  const changes = [];
  let index;

  for (index = 0; index < removed; index++) {
    if (index < inserted) {
      changes.push({
        type: UPDATE,
        path: [startIndex + index],
        value: target[startIndex + index],
        oldValue: spliceResult[index],
        object: this
      });
    } else {
      changes.push({
        type: DELETE,
        path: [startIndex + index],
        oldValue: spliceResult[index],
        object: this
      });
    }
  }

  for (; index < inserted; index++) {
    changes.push({
      type: INSERT,
      path: [startIndex + index],
      value: target[startIndex + index],
      object: this
    });
  }

  callObservers(oMeta, changes);
  return spliceResult;
},
      proxiedTypedArraySet = function proxiedTypedArraySet(source, offset) {
  const oMeta = this[oMetaKey],
        target = oMeta.target,
        souLen = source.length,
        prev = target.slice(0);
  offset = offset || 0;
  target.set(source, offset);
  const changes = new Array(souLen);

  for (let i = offset; i < souLen + offset; i++) {
    changes[i - offset] = {
      type: UPDATE,
      path: [i],
      value: target[i],
      oldValue: prev[i],
      object: this
    };
  }

  callObservers(oMeta, changes);
},
      proxiedArrayMethods = {
  pop: proxiedPop,
  push: proxiedPush,
  shift: proxiedShift,
  unshift: proxiedUnshift,
  reverse: proxiedReverse,
  sort: proxiedSort,
  fill: proxiedFill,
  copyWithin: proxiedCopyWithin,
  splice: proxiedSplice
},
      proxiedTypedArrayMethods = {
  reverse: proxiedReverse,
  sort: proxiedSort,
  fill: proxiedFill,
  copyWithin: proxiedCopyWithin,
  set: proxiedTypedArraySet
};

class OMetaBase {
  constructor(properties, cloningFunction) {
    const {
      target,
      parent,
      ownKey
    } = properties;

    if (parent && ownKey !== undefined) {
      this.parent = parent;
      this.ownKey = ownKey;
    } else {
      this.parent = null;
      this.ownKey = null;
    }

    const targetClone = cloningFunction(target, this);
    this.observers = [];
    this.revocable = Proxy.revocable(targetClone, this);
    this.proxy = this.revocable.proxy;
    this.target = targetClone;
    this.options = this.processOptions(properties.options);
  }

  processOptions(options) {
    if (options) {
      if (typeof options !== 'object') {
        throw new Error(`Observable options if/when provided, MAY only be an object, got '${options}'`);
      }

      const invalidOptions = Object.keys(options).filter(option => !validObservableOptionKeys.hasOwnProperty(option));

      if (invalidOptions.length) {
        throw new Error(`'${invalidOptions.join(', ')}' is/are not a valid Observable option/s`);
      }

      return Object.assign({}, options);
    } else {
      return {};
    }
  }

  detach() {
    this.parent = null;
    return this.target;
  }

  set(target, key, value) {
    let oldValue = target[key];

    if (value !== oldValue) {
      const newValue = getObservedOf(value, key, this);
      target[key] = newValue;

      if (oldValue && typeof oldValue === 'object') {
        const tmpObserved = oldValue[oMetaKey];

        if (tmpObserved) {
          oldValue = tmpObserved.detach();
        }
      }

      const changes = oldValue === undefined ? [{
        type: INSERT,
        path: [key],
        value: newValue,
        object: this.proxy
      }] : [{
        type: UPDATE,
        path: [key],
        value: newValue,
        oldValue: oldValue,
        object: this.proxy
      }];
      callObservers(this, changes);
    }

    return true;
  }

  deleteProperty(target, key) {
    let oldValue = target[key];
    delete target[key];

    if (oldValue && typeof oldValue === 'object') {
      const tmpObserved = oldValue[oMetaKey];

      if (tmpObserved) {
        oldValue = tmpObserved.detach();
      }
    }

    const changes = [{
      type: DELETE,
      path: [key],
      oldValue: oldValue,
      object: this.proxy
    }];
    callObservers(this, changes);
    return true;
  }

}

class ObjectOMeta extends OMetaBase {
  constructor(properties) {
    super(properties, prepareObject);
  }

}

class ArrayOMeta extends OMetaBase {
  constructor(properties) {
    super(properties, prepareArray);
  }

  get(target, key) {
    if (proxiedArrayMethods.hasOwnProperty(key)) {
      return proxiedArrayMethods[key];
    } else {
      return target[key];
    }
  }

}

class TypedArrayOMeta extends OMetaBase {
  constructor(properties) {
    super(properties, prepareTypedArray);
  }

  get(target, key) {
    if (proxiedTypedArrayMethods.hasOwnProperty(key)) {
      return proxiedTypedArrayMethods[key];
    } else {
      return target[key];
    }
  }

}

class Observable {
  constructor() {
    throw new Error('Observable MAY NOT be created via constructor, see "Observable.from" API');
  }

  static from(target, options) {
    if (!target || typeof target !== 'object') {
      throw new Error('observable MAY ONLY be created from a non-null object');
    } else if (target[oMetaKey]) {
      return target;
    } else if (Array.isArray(target)) {
      return new ArrayOMeta({
        target: target,
        ownKey: null,
        parent: null,
        options: options
      }).proxy;
    } else if (ArrayBuffer.isView(target)) {
      return new TypedArrayOMeta({
        target: target,
        ownKey: null,
        parent: null,
        options: options
      }).proxy;
    } else if (target instanceof Date || target instanceof Error) {
      throw new Error(`${target} found to be one of a on-observable types`);
    } else {
      return new ObjectOMeta({
        target: target,
        ownKey: null,
        parent: null,
        options: options
      }).proxy;
    }
  }

  static isObservable(input) {
    return !!(input && input[oMetaKey]);
  }

}

Object.freeze(Observable);

var imageExtensions = [
	"ase",
	"art",
	"bmp",
	"blp",
	"cd5",
	"cit",
	"cpt",
	"cr2",
	"cut",
	"dds",
	"dib",
	"djvu",
	"egt",
	"exif",
	"gif",
	"gpl",
	"grf",
	"icns",
	"ico",
	"iff",
	"jng",
	"jpeg",
	"jpg",
	"jfif",
	"jp2",
	"jps",
	"lbm",
	"max",
	"miff",
	"mng",
	"msp",
	"nitf",
	"ota",
	"pbm",
	"pc1",
	"pc2",
	"pc3",
	"pcf",
	"pcx",
	"pdn",
	"pgm",
	"PI1",
	"PI2",
	"PI3",
	"pict",
	"pct",
	"pnm",
	"pns",
	"ppm",
	"psb",
	"psd",
	"pdd",
	"psp",
	"px",
	"pxm",
	"pxr",
	"qfx",
	"raw",
	"rle",
	"sct",
	"sgi",
	"rgb",
	"int",
	"bw",
	"tga",
	"tiff",
	"tif",
	"vtf",
	"xbm",
	"xcf",
	"xpm",
	"3dv",
	"amf",
	"ai",
	"awg",
	"cgm",
	"cdr",
	"cmx",
	"dxf",
	"e2d",
	"egt",
	"eps",
	"fs",
	"gbr",
	"odg",
	"svg",
	"stl",
	"vrml",
	"x3d",
	"sxd",
	"v2d",
	"vnd",
	"wmf",
	"emf",
	"art",
	"xar",
	"png",
	"webp",
	"jxr",
	"hdp",
	"wdp",
	"cur",
	"ecw",
	"iff",
	"lbm",
	"liff",
	"nrrd",
	"pam",
	"pcx",
	"pgf",
	"sgi",
	"rgb",
	"rgba",
	"bw",
	"int",
	"inta",
	"sid",
	"ras",
	"sun",
	"tga"
];

var videoExtensions = [
	"3g2",
	"3gp",
	"aaf",
	"asf",
	"avchd",
	"avi",
	"drc",
	"flv",
	"m2v",
	"m4p",
	"m4v",
	"mkv",
	"mng",
	"mov",
	"mp2",
	"mp4",
	"mpe",
	"mpeg",
	"mpg",
	"mpv",
	"mxf",
	"nsv",
	"ogg",
	"ogv",
	"qt",
	"rm",
	"rmvb",
	"roq",
	"svi",
	"vob",
	"webm",
	"wmv",
	"yuv"
];

function utilsFactory(globals) {
  const g = globals || _g;

  const generateBareUrl = (type, integrationID) => `https://api.easybase.io/${type}/${integrationID}`;

  const generateAuthBody = () => {
    const stamp = Date.now();
    return {
      token: g.token,
      token_time: ~~(g.session / (stamp % 64)),
      now: stamp
    };
  };

  function log(...params) {
    if (g.options.logging) {
      console.log("EASYBASE — ", ...params);
    }
  }

  return {
    generateAuthBody,
    generateBareUrl,
    log
  };
}

function authFactory(globals) {
  const g = globals || _g;
  const {
    generateBareUrl,
    generateAuthBody,
    log
  } = utilsFactory(g);

  function _clearTokens() {
    g.token = "";
    g.refreshToken = "";
    g.newTokenCallback();
  }

  const getUserAttributes = async () => {
    try {
      const attrsRes = await tokenPost(POST_TYPES.USER_ATTRIBUTES);
      return attrsRes.data;
    } catch (error) {
      log(error);
      return error;
    }
  };

  const setUserAttribute = async (key, value) => {
    try {
      const setAttrsRes = await tokenPost(POST_TYPES.SET_ATTRIBUTE, {
        key,
        value
      });
      return {
        success: setAttrsRes.success,
        message: JSON.stringify(setAttrsRes.data)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error",
        errorCode: error.errorCode || undefined
      };
    }
  };

  const forgotPassword = async (username, emailTemplate) => {
    try {
      const setAttrsRes = await tokenPost(POST_TYPES.FORGOT_PASSWORD_SEND, {
        username,
        emailTemplate
      });
      return {
        success: setAttrsRes.success,
        message: setAttrsRes.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error",
        errorCode: error.errorCode || undefined
      };
    }
  };

  const forgotPasswordConfirm = async (code, username, newPassword) => {
    try {
      const setAttrsRes = await tokenPost(POST_TYPES.FORGOT_PASSWORD_CONFIRM, {
        username,
        code,
        newPassword
      });
      return {
        success: setAttrsRes.success,
        message: setAttrsRes.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error",
        errorCode: error.errorCode || undefined
      };
    }
  };

  const signUp = async (newUserID, password, userAttributes) => {
    try {
      const signUpRes = await tokenPost(POST_TYPES.SIGN_UP, {
        newUserID,
        password,
        userAttributes
      });
      return {
        success: signUpRes.success,
        message: signUpRes.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error",
        errorCode: error.errorCode || undefined
      };
    }
  };

  const signIn = async (userID, password) => {
    const t1 = Date.now();
    g.session = Math.floor(100000000 + Math.random() * 900000000);
    const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

    try {
      const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
        method: "POST",
        headers: {
          'Eb-Post-Req': POST_TYPES.HANDSHAKE,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: g.ebconfig.version,
          session: g.session,
          instance: g.instance,
          userID,
          password
        })
      });
      const resData = await res.json();

      if (resData.token) {
        g.token = resData.token;
        g.refreshToken = resData.refreshToken;
        g.newTokenCallback();
        g.mounted = true;
        const validTokenRes = await tokenPost(POST_TYPES.VALID_TOKEN);
        const elapsed = Date.now() - t1;

        if (validTokenRes.success) {
          log("Valid auth initiation in " + elapsed + "ms");
          return {
            success: true,
            message: "Successfully signed in user"
          };
        } else {
          return {
            success: false,
            message: "Could not sign in user"
          };
        }
      } else {
        return {
          success: false,
          message: "Could not sign in user",
          errorCode: resData.ErrorCode || undefined
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Could not sign in user",
        errorCode: error.errorCode || undefined
      };
    }
  };

  const resetUserPassword = async newPassword => {
    if (typeof newPassword !== "string" || newPassword.length > 100) {
      return {
        success: false,
        message: "newPassword must be of type string"
      };
    }

    try {
      const setAttrsRes = await tokenPost(POST_TYPES.RESET_PASSWORD, {
        newPassword
      });
      return {
        success: setAttrsRes.success,
        message: JSON.stringify(setAttrsRes.data)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error",
        errorCode: error.errorCode || undefined
      };
    }
  };

  const isUserSignedIn = () => g.token.length > 0;

  const signOut = () => {
    g.token = "";
    g.newTokenCallback();
  };

  const initAuth = async () => {
    const t1 = Date.now();
    g.session = Math.floor(100000000 + Math.random() * 900000000);
    log(`Handshaking on${g.instance} instance`);
    const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";

    try {
      const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
        method: "POST",
        headers: {
          'Eb-Post-Req': POST_TYPES.HANDSHAKE,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: g.ebconfig.version,
          tt: g.ebconfig.tt,
          session: g.session,
          instance: g.instance
        })
      });
      const resData = await res.json();

      if (resData.token) {
        g.token = resData.token;
        g.mounted = true;
        const validTokenRes = await tokenPost(POST_TYPES.VALID_TOKEN);
        const elapsed = Date.now() - t1;

        if (validTokenRes.success) {
          log("Valid auth initiation in " + elapsed + "ms");
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const tokenPost = async (postType, body) => {
    if (!g.mounted) {
      await initAuth();
    }

    const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";
    const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
      method: "POST",
      headers: {
        'Eb-Post-Req': postType,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_extends({
        _auth: generateAuthBody()
      }, body))
    });
    const resData = await res.json();

    if ({}.hasOwnProperty.call(resData, 'ErrorCode') || {}.hasOwnProperty.call(resData, 'code')) {
      if (resData.ErrorCode === "TokenExpired") {
        if (integrationType === "PROJECT") {
          try {
            const req_res = await tokenPost(POST_TYPES.REQUEST_TOKEN, {
              refreshToken: g.refreshToken,
              token: g.token
            });

            if (req_res.success) {
              g.token = req_res.data.token;
              g.newTokenCallback();
              return tokenPost(postType, body);
            } else {
              throw new Error(req_res.data || "Error");
            }
          } catch (error) {
            _clearTokens();

            return {
              success: false,
              data: error.message || error
            };
          }
        } else {
          await initAuth();
        }

        return tokenPost(postType, body);
      } else {
        const err = new Error(resData.body || resData.ErrorCode || resData.code || "Error");
        err.errorCode = resData.ErrorCode || resData.code;
        throw err;
      }
    } else {
      return {
        success: resData.success,
        data: resData.body
      };
    }
  };

  const tokenPostAttachment = async (formData, customHeaders) => {
    if (!g.mounted) {
      await initAuth();
    }

    const regularAuthbody = generateAuthBody();
    const attachmentAuth = {
      'Eb-token': regularAuthbody.token,
      'Eb-token-time': regularAuthbody.token_time,
      'Eb-now': regularAuthbody.now
    };
    const integrationType = g.ebconfig.integration.split("-")[0].toUpperCase() === "PROJECT" ? "PROJECT" : "REACT";
    const res = await fetch(generateBareUrl(integrationType, g.integrationID), {
      method: "POST",
      headers: _extends({
        'Eb-Post-Req': POST_TYPES.UPLOAD_ATTACHMENT
      }, customHeaders, attachmentAuth),
      body: formData
    });
    const resData = await res.json();

    if ({}.hasOwnProperty.call(resData, 'ErrorCode') || {}.hasOwnProperty.call(resData, 'code')) {
      if (resData.ErrorCode === "TokenExpired") {
        if (integrationType === "PROJECT") {
          try {
            const req_res = await tokenPost(POST_TYPES.REQUEST_TOKEN, {
              refreshToken: g.refreshToken,
              token: g.token
            });

            if (req_res.success) {
              g.token = req_res.data.token;
              g.newTokenCallback();
              return tokenPostAttachment(formData, customHeaders);
            } else {
              throw new Error(req_res.data || "Error");
            }
          } catch (error) {
            _clearTokens();

            return {
              success: false,
              data: error.message || error
            };
          }
        } else {
          await initAuth();
        }

        return tokenPostAttachment(formData, customHeaders);
      } else {
        const err = new Error(resData.body || resData.ErrorCode || resData.code || "Error");
        err.errorCode = resData.ErrorCode || resData.code;
        throw err;
      }
    } else {
      return {
        success: resData.success,
        data: resData.body
      };
    }
  };

  return {
    initAuth,
    tokenPost,
    tokenPostAttachment,
    signUp,
    setUserAttribute,
    getUserAttributes,
    isUserSignedIn,
    signIn,
    signOut,
    resetUserPassword,
    forgotPassword,
    forgotPasswordConfirm
  };
}

function tableFactory(globals) {
  const g = globals || _g;
  const {
    tokenPost
  } = authFactory(g);

  const Query = async options => {
    const defaultOptions = {
      queryName: ""
    };

    const fullOptions = _extends({}, defaultOptions, options);

    const res = await tokenPost(POST_TYPES.GET_QUERY, fullOptions);

    if (res.success) {
      return res.data;
    } else {
      return [];
    }
  };

  async function fullTableSize(tableName) {
    const res = await tokenPost(POST_TYPES.TABLE_SIZE, tableName ? {
      tableName
    } : {});

    if (res.success) {
      return res.data;
    } else {
      return 0;
    }
  }

  async function tableTypes(tableName) {
    const res = await tokenPost(POST_TYPES.COLUMN_TYPES, tableName ? {
      tableName
    } : {});

    if (res.success) {
      return res.data;
    } else {
      return {};
    }
  }

  return {
    Query,
    fullTableSize,
    tableTypes
  };
}

/** Returns a function the creates a new context */
const createNewContext = defaultContext => {
    const { parameterize, escape, mapKey, build } = defaultContext;

    return (inherit = {}) => {
        const { params = [], unparameterized = false } = inherit;

        const whr = [];
        return {
            // properties set by the EasyQB instance
            parameterize,
            escape,
            mapKey,
            build,

            // properties inherited from the parent query
            params,
            unparameterized,

            // properties of the current query
            type: 'select',
            // | sql' | 'select' | 'delete' | 'insert' | 'update'
            target: whr,
            join: undefined,
            separator: ' ',
            sql: [],
            ret: [],
            frm: [],
            whr,
            grp: [],
            hav: [],
            setop: [],
            ord: [],
            with: [],
            set: []

            // properties that may be added dynamically:
            // userType
            // distinct
        }
    }
};

var context = createNewContext;

const createQueryBuilder = ({ defaultContext, query, e, config }) => {
    const { queries, methods, properties } = query;
    const newContext = context(defaultContext);
    const reducers = createReducers(methods);
    const updateContext = applyReducers(reducers);
    reducers.extend = (ctx, args) => {
        const arr = Array.isArray(args[0]) ? args[0] : args;
        for (let i = 0; i < arr.length; ++i) {
            updateContext(arr[i].method, ctx);
        }
    };
    const builder = () => { }; // must not be object literal
    const chain = createChain(builder);

    const executeProperties = {
        one: {
            value: async function () {
                const ret = await config.oneCallback(this.query, config.tableName, config.userAssociatedRecordsOnly);
                return ret;
            }
        },
        all: {
            value: async function () {
                const ret = await config.allCallback(this.query, config.tableName, config.userAssociatedRecordsOnly);
                return ret;
            }
        },
        _tableName: {
            get: function () {
                return config.tableName
            }
        }
    };

    // EasyQB no access to from
    const _methodProperties = methodProperties({ methods, chain });
    delete _methodProperties.from;

    Object.defineProperties(builder, {
        ...builderProperties({ chain, newContext, updateContext, queries }),
        ..._methodProperties,
        ...executeProperties,
        ...properties,
        e: {
            value: e
        }
    });
    return chain()
};

/** Creates a new builder instance */
const createChain = prototype => {
    const chain = method => {
        const fn = (...args) => chain({ name: 'express', args, prev: method });
        fn.method = method;
        Object.setPrototypeOf(fn, prototype);
        return fn
    };
    return chain
};

/** Creates an object containing all method reducers */
const createReducers = methods => {
    const reducers = {};
    for (const name in methods) {
        const { updateContext, properties = {} } = methods[name];
        reducers[name] = updateContext;
        // some methods have subproperties, e.g. .unionAll
        for (const key in properties) {
            reducers[`${name}.${key}`] = properties[key];
        }
    }
    return reducers
};

/** Follows a method chain, applying each method's reducer, to ctx */
const applyReducers = reducers => (method, ctx) => {
    // follow method links to construct methods array (in reverse)
    const methods = [];
    for (; method !== undefined; method = method.prev) {
        methods.push(method);
    }
    // build methods object by processing methods in call order
    const express = { id: 0 };
    for (let i = methods.length - 1; i >= 0; --i) {
        const method = methods[i];
        reducers[method.name](ctx, method.args, express);
    }
    return ctx
};

/** Default properties of all SQL Query Builders */
const builderProperties = ({ newContext, updateContext, queries }) => ({
    _build: {
        value: function (inheritedContext) {
            const ctx = updateContext(this.method, newContext(inheritedContext));
            return queries[ctx.type](ctx)
        }
    },
    query: {
        get: function () {
            return this._build()
        }
    },
    unparameterized: {
        get: function () {
            return this._build({ unparameterized: true }).text
        }
    }
});

/** Builds object containing a property for every query building method */
const methodProperties = ({ methods, chain }) => {
    const properties = {};
    for (const name in methods) {
        const { getter } = methods[name];
        if (getter) {
            // add getter methods
            properties[name] = {
                get: function () {
                    return chain({ name, prev: this.method })
                }
            };
        } else {
            // add function call methods
            properties[name] = {
                value: function (...args) {
                    return chain({ name, args, prev: this.method })
                }
            };
        }
    }
    return properties
};

var builderSq = createQueryBuilder;

const isTaggedTemplate = ([strings]) => Array.isArray(strings) && strings.raw;

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let txt = strings[0];
  for (let i = 0; i < args.length; ++i) {
    txt += ctx.build(args[i]) + strings[i + 1];
  }
  return txt
};

var tagged_template = {
  isTaggedTemplate,
  buildTaggedTemplate
};

const { isTaggedTemplate: isTaggedTemplate$1, buildTaggedTemplate: buildTaggedTemplate$1 } = tagged_template;

const isObject = arg => arg && arg.constructor.prototype === Object.prototype;

const buildCall = callbackfn => (ctx, args) =>
  isTaggedTemplate$1(args)
    ? buildTaggedTemplate$1(ctx, args)
    : callbackfn(ctx, args);

const mapJoin = (callbackfn, separator = ', ') => (ctx, args) => {
  let txt = '';
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += separator;
    txt += callbackfn(ctx, args[i]);
  }
  return txt
};

const mapJoinWrap = (callbackfn, separator = ', ', open = '(', close = ')') => (
  ctx,
  args
) => {
  let txt = open;
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += separator;
    txt += callbackfn(ctx, args[i]);
  }
  return txt + close
};

const objectMapJoin = (callbackfn, separator = ', ') => (ctx, object) => {
  let txt = '';
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += separator;
    const key = keys[i];
    txt += callbackfn(ctx, key, object[key]);
  }
  return txt
};

var build_utils = {
  isObject,
  buildCall,
  mapJoin,
  mapJoinWrap,
  objectMapJoin
};

// included to mitigate cost of case conversion
const memoize = fn => {
  const cache = {};
  return key => cache[key] || (cache[key] = fn(key))
};

const normalKey = given_key => given_key.indexOf('(') === -1 ? given_key.toLowerCase().trim().replace(/ /g, '_') : given_key;

var change_case = {
  memoize,
  normalKey
};

var libUtil = {
  ...build_utils,
  ...change_case,
  ...tagged_template
};

const { isTaggedTemplate: isTaggedTemplate$2 } = libUtil;

const createExpressionCompiler = expressionTable => {
  const callsCompiler = createCallsCompiler(expressionTable);
  return (ctx, current) => {
    const calls = buildCalls(current);
    const text = callsCompiler(ctx, calls);
    return {
      text,
      args: ctx.params,
      type: 'expression'
    }
  }
};

// TODO: Performance optimization:
// inline expression building with this method so at most only one array
// is allocated in total, no array of object containing arrays nonsense
const buildCalls = current => {
  // get call nodes
  const calls = [];
  for (; current; current = current.prev) calls.push(current);
  if (calls.length === 0) throw Error('Error: Empty expression')

  // build expression list
  let expression = { name: 'arg', args: [] };
  const expressions = [expression];
  const last = calls.length - 1;
  for (let i = last; i >= 0; --i) {
    const { name, args } = calls[i];
    if (i === last) {
      if (name) expression.name = name;
      else pushCall(expression.args, args);
    } else {
      if (name) expressions.push((expression = { name, args: [undefined] }));
      else pushCall(expression.args, args);
    }
  }
  return expressions
};

const pushCall = (array, args) => {
  if (isTaggedTemplate$2(args)) {
    array.push({ tag: args });
  } else {
    if (args.length === 0)
      throw Error('Error: Expression call requires at least one argument')
    for (let i = 0; i < args.length; ++i) {
      array.push({ arg: args[i] });
    }
  }
};

const createCallsCompiler = expressionTable => (ctx, calls) => {
  let exp;
  for (let i = 0; i < calls.length; ++i) {
    const { name, args } = calls[i];
    const { build, minArgs, maxArgs } = expressionTable[name];
    if (i !== 0) args[0] = { exp };
    const numArgs = args.length;
    if (numArgs < minArgs)
      throw Error(`Error: ${name} requires at least ${minArgs} arguments`)
    if (numArgs > maxArgs)
      throw Error(`Error: ${name} accepts at most ${maxArgs} arguments`)
    exp = build(ctx, args);
  }
  return exp
};

var compile = createExpressionCompiler;

const { normalKey: normalKey$1 } = libUtil;

const aggregator = (op) => (columnName) => `${op}(${normalKey$1(columnName)})`;

var builderExpression = ({ defaultContext, expression }) => {
  const { expressions } = expression;
  const newContext = createNewContext$1(defaultContext);
  const compile$1 = compile(expressions);
  const builder = () => {}; // must not be object literal
  const chain = createChain$1(builder);
  Object.defineProperties(builder, {
    ...builderProperties$1({ compile: compile$1, newContext }),
    ...methodProperties$1({ expressions, chain }),
  });
  const ret = chain();
  ret.max = aggregator('max');
  ret.min = aggregator('min');
  ret.avg = aggregator('avg');
  ret.count = aggregator('count');
  ret.sum = aggregator('sum');
  return ret;
};

const builderProperties$1 = ({ compile, newContext }) => ({
  _build: {
    value: function(inherit) {
      return compile(newContext(inherit), this.current)
    }
  },
  query: {
    get: function() {
      return this._build()
    }
  },
  unparameterized: {
    get: function() {
      return this._build({ unparameterized: true }).text
    }
  }
});

const createNewContext$1 = defaultContext => {
  const { build, parameterize, escape, mapKey } = defaultContext;
  return inherit => {
    const { params = [], unparameterized = false } = inherit || {};
    return {
      // EasyQB instance properties
      build,
      parameterize,
      escape,
      mapKey,

      // inherited properties
      params,
      unparameterized
    }
  }
};

const createChain$1 = prototype => {
  const chain = current => {
    const fn = (...args) => chain({ prev: current, args });
    fn.current = current;
    Object.setPrototypeOf(fn, prototype);
    return fn
  };
  return chain
};

const methodProperties$1 = ({ expressions, chain }) => {
  const properties = {};
  for (const name in expressions) {
    properties[name] = {
      get: function() {
        return chain({ prev: this.current, name })
      }
    };
  }
  return properties
};

const { memoize: memoize$1, normalKey: normalKey$2 } = libUtil;


/**
 * Creates a version of EasyQB for the given SQL dialect and database adapter.
 *
 * A dialect is variant of the SQL language,
 * while an adapter is the driver that communicates with the database.
 *
 * This design makes it easy to swap drivers, e.g. mysql vs mysql2 or
 * add new databases just by connecting a new adapter to an existing dialect.
 *
 */

const createSqorn = ({ dialect }) => (config = {}) => {
  const { query, expression, parameterize, escape } = dialect;

  // 1. Create default context properties passed through build tree
  const mapKey = memoize$1(normalKey$2);
  const defaultContext = { parameterize, escape, mapKey, build };

  // 2. Create Expression Builder
  const e = builderExpression({ defaultContext, expression });

  // 3. Create Query Builder
  const sq = builderSq({ defaultContext, query, e, config });

  // 4. TODO: Build Executor, Attach e and execute functions

  // 5. TODO: Return { sq, e, transaction, db }
  return sq
};

function build(arg) {
  if (arg === undefined) throw Error('Error: undefined argument')
  if (typeof arg === 'function') {
    if (arg._build) {
      const { type, text } = arg._build(this);
      if (type === 'expression') return text
      if (type === 'fragment') return text
      return `(${text})`
    }
    return arg(this)
  }
  return this.unparameterized ? this.escape(arg) : this.parameterize(arg)
}

var libCore = createSqorn;

const { normalKey: normalKey$3 } = libUtil;

/** Query building methods */
const methods = {
    with: {
        updateContext: (ctx, args) => {
            ctx.with.push(args);
        }
    },
    withRecursive: {
        updateContext: (ctx, args) => {
            ctx.recursive = true;
            ctx.with.push(args);
        }
    },
    from: {
        updateContext: (ctx, args) => {
            ctx.frm.push({ args, join: ', ' });
        }
    },
    where: {
        updateContext: (ctx, args) => {
            ctx.whr.push(args);
            ctx.target = ctx.whr;
        }
    },
    return: {
        updateContext: (ctx, args) => {
            ctx.ret.push(Array.isArray(args) ? args.map(normalKey$3) : args);
        }
    },
    distinct: {
        getter: true,
        updateContext: ctx => {
            ctx.distinct = [];
        }
    },
    groupBy: {
        updateContext: (ctx, args) => {
            ctx.grp.push(args);
        }
    },
    having: {
        updateContext: (ctx, args) => {
            ctx.hav.push(args);
            ctx.target = ctx.hav;
        }
    },
    union: {
        updateContext: (ctx, args) => {
            ctx.setop.push({ type: 'union', args });
        }
    },
    unionAll: {
        updateContext: (ctx, args) => {
            ctx.setop.push({ type: 'union all', args });
        }
    },
    intersect: {
        updateContext: (ctx, args) => {
            ctx.setop.push({ type: 'intersect', args });
        }
    },
    intersectAll: {
        updateContext: (ctx, args) => {
            ctx.setop.push({ type: 'intersect all', args });
        }
    },
    except: {
        updateContext: (ctx, args) => {
            ctx.setop.push({ type: 'except', args });
        }
    },
    exceptAll: {
        updateContext: (ctx, args) => {
            ctx.setop.push({ type: 'except all', args });
        }
    },
    orderBy: {
        updateContext: (ctx, args) => {
            ctx.ord.push(args);
        }
    },
    limit: {
        updateContext: (ctx, args) => {
            ctx.limit = args;
        }
    },
    offset: {
        updateContext: (ctx, args) => {
            ctx.offset = args;
        }
    },
    join: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' join ' }));
        }
    },
    leftJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' left join ' }));
        }
    },
    rightJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' right join ' }));
        }
    },
    fullJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' full join ' }));
        }
    },
    crossJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' cross join ' }));
        }
    },
    naturalJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' natural join ' }));
        }
    },
    naturalLeftJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' natural left join ' }));
        }
    },
    naturalRightJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' natural right join ' }));
        }
    },
    naturalFullJoin: {
        updateContext: (ctx, args) => {
            ctx.frm.push((ctx.join = { args, join: ' natural full join ' }));
        }
    },
    on: {
        updateContext: (ctx, args) => {
            const { join } = ctx;
            if (join.on) {
                join.on.push(args);
            } else {
                ctx.target = join.on = [args];
            }
        }
    },
    using: {
        updateContext: (ctx, args) => {
            const { join } = ctx;
            if (join.using) {
                join.using.push(args);
            } else {
                join.using = [args];
            }
        }
    },
    delete: {
        // getter: true,
        updateContext: ctx => {
            ctx.type = 'delete';
        }
    },
    insert: {
        updateContext: (ctx, args) => {
            ctx.type = 'insert';
            ctx.insert = args;
        }
    },
    set: {
        updateContext: (ctx, args) => {
            ctx.type = 'update';
            ctx.set.push(args);
        }
    },
    express: {
        updateContext: (ctx, args, count) => {
            if (count.id === 0) {
                count.id++;
                ctx.frm.push((ctx.join = { type: 'from', args, join: ', ' }));
            } else if (count.id === 1) {
                count.id++;
                ctx.whr.push(args);
            } else if (count.id === 2) {
                count.id++;
                ctx.ret.push(args);
            } else throw Error('Invalid express call')
        }
    }
};

var methods_1 = methods;

const { mapJoin: mapJoin$1 } = libUtil;

var values_array = (ctx, array) => {
  const keys = uniqueKeys(array);
  return {
    columns: columns(ctx, keys),
    values: values(ctx, array, keys)
  }
};

// gets unique keys in object array
const uniqueKeys = array => {
  const keys = {};
  for (const object of array) {
    for (const key in object) {
      keys[key] = true;
    }
  }
  return Object.keys(keys)
};

// gets column string from unique keys of object array
const columns = mapJoin$1((ctx, arg) => ctx.mapKey(arg));

// gets values string of object array
const values = (ctx, source, keys) => {
  let txt = 'values ';
  for (let i = 0; i < source.length; ++i) {
    if (i !== 0) txt += ', ';
    txt += '(';
    const object = source[i];
    for (let j = 0; j < keys.length; ++j) {
      if (j !== 0) txt += ', ';
      txt += value(ctx, object[keys[j]]);
    }
    txt += ')';
  }
  return txt
};

const value = (ctx, arg) => {
  if (arg === undefined) return 'default'
  return ctx.build(arg)
};

const {
  isObject: isObject$1,
  buildCall: buildCall$1,
  mapJoin: mapJoin$2,
  objectMapJoin: objectMapJoin$1
} = libUtil;


var _with = ctx => {
  if (ctx.with.length === 0) return
  const txt = calls(ctx, ctx.with);
  return txt && `with ${ctx.recursive ? 'recursive ' : ''}${txt}`
};

const buildArg = (ctx, arg) => {
  if (isObject$1(arg)) return buildObject(ctx, arg)
  throw Error('Invalid with argument:', arg)
};

const buildProperty = (ctx, key, value) => {
  if (typeof value === 'function') {
    return `${ctx.mapKey(key)} ${ctx.build(value)}`
  }
  if (Array.isArray(value)) {
    const { columns, values } = values_array(ctx, value);
    return `${ctx.mapKey(key)}(${columns}) (${values})`
  }
  throw Error(`Error: Invalid .with argument`)
};

const buildObject = objectMapJoin$1(buildProperty);
const calls = mapJoin$2(buildCall$1(mapJoin$2(buildArg)));

const {
  isObject: isObject$2,
  buildCall: buildCall$2,
  mapJoin: mapJoin$3,
  objectMapJoin: objectMapJoin$2
} = libUtil;

const buildArg$1 = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (isObject$2(arg)) return buildObject$1(ctx, arg)
  return ctx.build(arg)
};

const buildProperty$1 = (ctx, key, value) => {
  const expression = typeof value === 'string' ? value : ctx.build(value);
  return `${expression} ${ctx.mapKey(key)}`
};

const buildObject$1 = objectMapJoin$2(buildProperty$1);
var expressions = mapJoin$3(buildCall$2(mapJoin$3(buildArg$1)));

var select = ctx =>
  `select ${buildDistinct(ctx)}${expressions(ctx, ctx.ret) || '*'}`;

const buildDistinct = ctx =>
  ctx.distinct
    ? ctx.distinct.length
      ? // TODO: expressions shouldn't be aliasable here
        `distinct on (${expressions(ctx, ctx.distinct)})`
      : 'distinct'
    : '';

const {
  isTaggedTemplate: isTaggedTemplate$3,
  buildTaggedTemplate: buildTaggedTemplate$2,
  isObject: isObject$3,
  mapJoin: mapJoin$4,
  objectMapJoin: objectMapJoin$3
} = libUtil;

const buildCall$3 = callbackfn => (ctx, args) =>
  isTaggedTemplate$3(args)
    ? `(${buildTaggedTemplate$2(ctx, args)})`
    : callbackfn(ctx, args);

const buildArg$2 = (ctx, arg) =>
  isObject$3(arg) ? buildObject$2(ctx, arg) : ctx.build(arg);

const valuesList = mapJoin$4((ctx, arg) => ctx.build(arg));

const buildProperty$2 = (ctx, key, value) => {
  const name = ctx.mapKey(key);
  if (value === null) return `(${name} is null)`
  if (Array.isArray(value)) return `(${name} in (${valuesList(ctx, value)}))`
  return `(${name} = ${ctx.build(value)})`
};

const buildObject$2 = objectMapJoin$3(buildProperty$2, ' and ');
var conditions = mapJoin$4(buildCall$3(mapJoin$4(buildArg$2, ' and ')), ' and ');

const {
  isObject: isObject$4,
  buildCall: buildCall$4,
  mapJoin: mapJoin$5,
  objectMapJoin: objectMapJoin$4
} = libUtil;



var from_items = (ctx, items, start = 0, end = items.length) => {
  if (end > items.length) end = items.length;
  let txt = '';
  for (let i = start; i < end; ++i) {
    const item = items[i];
    if (i !== start) txt += item.join;
    txt += fromItem(ctx, item.args);
    if (item.on) txt += ` on ${conditions(ctx, item.on)}`;
    else if (item.using) txt += ` using (${using(ctx, item.using)})`;
  }
  return txt
};

const usingArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  throw Error('Error: Invalid .using arg')
};
const using = mapJoin$5(buildCall$4(mapJoin$5(usingArg)));

const fromArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (isObject$4(arg)) return buildObject$3(ctx, arg)
  throw Error('Error: Invalid .from argument:', arg)
};

const buildProperty$3 = (ctx, key, value) => {
  if (typeof value === 'string') return `${value} ${ctx.mapKey(key)}`
  if (typeof value === 'function')
    return `${ctx.build(value)} ${ctx.mapKey(key)}`
  if (Array.isArray(value)) {
    const { columns, values } = values_array(ctx, value);
    return `(${values}) ${ctx.mapKey(key)}(${columns})`
  }
  throw Error('Error: Invalid .from argument')
};

const buildObject$3 = objectMapJoin$4(buildProperty$3);
const fromItem = buildCall$4(mapJoin$5(fromArg));

var from_1 = ctx => {
  const txt = from_items(ctx, ctx.frm);
  return txt && `from ${txt}`
};

var where = ctx => {
  if (ctx.whr.length === 0) return
  const txt = conditions(ctx, ctx.whr);
  return txt && 'where ' + txt
};

const { isObject: isObject$5, buildCall: buildCall$5, mapJoin: mapJoin$6, mapJoinWrap: mapJoinWrap$1 } = libUtil;

var group = ctx => {
  if (ctx.grp.length === 0) return
  const txt = calls$1(ctx, ctx.grp);
  return txt && `group by ${txt}`
};

const buildArg$3 = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (Array.isArray(arg)) return buildArrayArg(ctx, arg)
  if (isObject$5(arg)) return buildObject$4(ctx, arg)
  throw Error('Invalid order by argument:', arg)
};

const buildArrayArg = mapJoinWrap$1(buildArg$3);

// postgres only
// clone of buildArg() without support for object args
const buildCubeOrRollupArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (Array.isArray(arg)) return buildCubeOrRollupArrayArg(ctx, arg)
  throw Error('Invalid cube/rollup argument')
};

// postgres only
// clone of buildArrayArg() without support for object args
const buildCubeOrRollupArrayArg = mapJoinWrap$1(buildCubeOrRollupArg);

// postgres only
const buildObject$4 = (ctx, obj) => {
  const { type, args } = obj;
  if (type === 'rollup') {
    return `rollup ${buildCubeOrRollupArg(ctx, args)}`
  }
  if (type === 'cube') {
    return `cube ${buildCubeOrRollupArg(ctx, args)}`
  }
  if (type === 'grouping sets') {
    return `grouping sets ${buildArg$3(ctx, args)}`
  }
  throw Error('Invalid group by argument')
};

const calls$1 = mapJoin$6(buildCall$5(mapJoin$6(buildArg$3)));

var having = ctx => {
  if (ctx.hav.length === 0) return
  const txt = conditions(ctx, ctx.hav);
  return txt && 'having ' + txt
};

var setop = ctx => {
  if (ctx.setop.length === 0) return
  let txt = '';
  let first = true;
  const { setop } = ctx;
  for (let i = 0; i < setop.length; ++i) {
    const { type, args } = ctx.setop[i];
    for (let j = 0; j < args.length; ++j) {
      if (!first) {
        txt += ' ';
      } else {
        first = false;
      }
      txt += `${type} ${ctx.build(args[j])}`;
    }
  }
  return txt
};

const { isObject: isObject$6, buildCall: buildCall$6, mapJoin: mapJoin$7 } = libUtil;

var order = ctx => {
  if (ctx.ord.length === 0) return
  const txt = calls$2(ctx, ctx.ord);
  return txt && `order by ${txt}`
};

const buildArg$4 = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (isObject$6(arg)) return buildObject$5(ctx, arg)
  throw Error('Invalid order by argument:', arg)
};

const buildObject$5 = (ctx, obj) => {
  let txt = '';
  const { by, sort, using, nulls } = obj;
  // by
  if (typeof by === 'string') txt += by;
  else if (typeof by === 'function') txt += ctx.build(by);
  else throw Error('Invalid order by property "by"')
  // sort
  if (sort) {
    if (sort === 'desc') txt += ' desc';
    else if (sort === 'asc') txt += ' asc';
    else if (typeof sort === 'string') txt += ` using ${sort}`;
    else throw Error('Invalid order by property "sort"')
  } else if (using) {
    if (typeof using === 'string') txt += ` using ${using}`;
    else throw Error('Invalid order by property "using"')
  }
  // nulls
  if (nulls === undefined);
  else if (nulls === 'last') txt += ' nulls last';
  else if (nulls === 'first') txt += ' nulls first';
  else throw Error('Invalid order by property "nulls"')
  // return
  return txt
};

const calls$2 = mapJoin$7(buildCall$6(mapJoin$7(buildArg$4)));

const { isTaggedTemplate: isTaggedTemplate$4, buildTaggedTemplate: buildTaggedTemplate$3 } = libUtil;

var limit_offset = (ctx, args) => {
  if (isTaggedTemplate$4(args)) return buildTaggedTemplate$3(ctx, args)
  const arg = args[0];
  if (typeof arg === 'number') return ctx.parameterize(arg)
  if (typeof arg === 'function') return ctx.build(arg)
  throw Error('Error: Invalid limit/offset argument')
};

var limit = ctx => ctx.limit && `limit ${limit_offset(ctx, ctx.limit)}`;

var offset = ctx => ctx.offset && `offset ${limit_offset(ctx, ctx.offset)}`;

var _delete = ctx => {
  const txt = from_items(ctx, ctx.frm);
  return txt && `delete from ${txt}`
};

var returning = ctx => {
  if (!ctx.ret) return
  const txt = expressions(ctx, ctx.ret);
  return txt && `returning ${txt}`
};

const { isTaggedTemplate: isTaggedTemplate$5, buildTaggedTemplate: buildTaggedTemplate$4 } = libUtil;



var insert = ctx => {
  const table = from_items(ctx, ctx.frm);
  const values = buildCall$7(ctx, ctx.insert);
  return `insert into ${table}${values}`
};

const buildCall$7 = (ctx, args) => {
  if (isTaggedTemplate$5(args)) return ' ' + buildTaggedTemplate$4(ctx, args)
  if (args.length === 1 && args[0] === undefined) return ' default values'
  if (Array.isArray(args[0])) return buildValuesArray(ctx, args[0])
  if (typeof args[0] === 'function') return ' ' + ctx.build(args[0])
  return buildValuesArray(ctx, args)
};

const buildValuesArray = (ctx, array) => {
  const { values, columns } = values_array(ctx, array);
  return `(${columns}) ${values}`
};

var update = ctx => {
  const txt = from_items(ctx, ctx.frm);
  return txt && `update ${txt}`
};

const { buildCall: buildCall$8, mapJoin: mapJoin$8, objectMapJoin: objectMapJoin$5 } = libUtil;

var set = ctx => {
  if (!ctx.set) return
  const txt = calls$3(ctx, ctx.set);
  return txt && 'set ' + txt
};

const buildProperty$4 = (ctx, key, value) =>
  `${ctx.mapKey(key)} = ${ctx.build(value)}`;

const calls$3 = mapJoin$8(buildCall$8(mapJoin$8(objectMapJoin$5(buildProperty$4))));

var clauses = {
  wth: _with,
  select: select,
  from: from_1,
  where: where,
  group: group,
  having: having,
  setop: setop,
  order: order,
  limit: limit,
  offset: offset,
  del: _delete,
  returning: returning,
  insert: insert,
  update: update,
  set: set
};

const {
    wth,
    select: select$1,
    from,
    where: where$1,
    group: group$1,
    having: having$1,
    setop: setop$1,
    order: order$1,
    limit: limit$1,
    offset: offset$1,
    del,
    returning: returning$1,
    insert: insert$1,
    update: update$1,
    set: set$1,
} = clauses;

const query = (...clauses) => ctx => {
    let text = '';
    for (const clause of clauses) {
        const str = clause && clause(ctx);
        if (str) {
            if (text) text += ctx.separator;
            text += str;
        }
    }
    return { text, args: ctx.params, type: ctx.userType || ctx.type }
};

const queries = {
    select: query(
        wth,
        select$1,
        from,
        where$1,
        group$1,
        having$1,
        setop$1,
        order$1,
        limit$1,
        offset$1
    ),
    update: query(wth, update$1, set$1, where$1, returning$1),
    delete: query(wth, del, where$1, returning$1),
    insert: query(wth, insert$1, returning$1)
};

var query_1 = { query, queries };

var common = {
  conditions,
  expressions,
  fromItems: from_items,
  limitOffset: limit_offset,
  valuesArray: values_array
};

const { query: query$1, queries: queries$1 } = query_1;



var libSq = {
  methods: methods_1,
  query: query$1,
  queries: queries$1,
  clauses,
  common
};

const { methods: methods$1, queries: queries$2, query: query$2, clauses: clauses$1, common: common$1 } = libSq;

const { fromItems, expressions: expressions$1 } = common$1;
const {
  wth: wth$1,
  from: from$1,
  where: where$2,
  group: group$2,
  having: having$2,
  setop: setop$2,
  order: order$2,
  limit: limit$2,
  offset: offset$2,
  returning: returning$2,
  set: set$2
} = clauses$1;

const postgresMethods = {
  distinctOn: {
    updateContext: (ctx, args) => {
      if (ctx.distinct) {
        ctx.distinct.push(args);
      } else {
        ctx.distinct = [args];
      }
    }
  }
};

// SELECT supports .distinctOn(...expressions)
const select$2 = ctx => {
  let txt = 'select ';
  if (ctx.distinct) {
    txt += 'distinct ';
    if (ctx.distinct.length) {
      txt += `on (${expressions$1(ctx, ctx.distinct)}) `;
    }
  }
  txt += expressions$1(ctx, ctx.ret) || '*';
  return txt
};
// DELETE: first .from call is used in the DELETE clause
// subsequent .from calls are used in the USING clause
const del$1 = ctx => {
  const txt = fromItems(ctx, ctx.frm, 0, 1);
  return txt && `delete from ${txt}`
};
const using$1 = ctx => {
  const txt = fromItems(ctx, ctx.frm, 1);
  return txt && `using ${txt}`
};
// UPDATE: first .from call is used in the UPDATE clause
// subsequent .from calls are used in the FROM clause
const update$2 = ctx => {
  const txt = fromItems(ctx, ctx.frm, 0, 1);
  return txt && `update ${txt}`
};
const updateFrom = ctx => {
  const txt = fromItems(ctx, ctx.frm, 1);
  return txt && `from ${txt}`
};

var query_1$1 = {
  methods: { ...methods$1, ...postgresMethods },
  queries: {
    ...queries$2,
    select: query$2(
      wth$1,
      select$2,
      from$1,
      where$2,
      group$2,
      having$2,
      setop$2,
      order$2,
      limit$2,
      offset$2
    ),
    delete: query$2(wth$1, del$1, using$1, where$2, returning$2),
    update: query$2(wth$1, update$2, set$2, updateFrom, where$2, returning$2)
  },
  properties: {
    rollup: {
      value: (...args) => {
        return {
          type: 'rollup',
          args
        }
      }
    },
    cube: {
      value: (...args) => {
        return {
          type: 'cube',
          args
        }
      }
    },
    groupingSets: {
      value: (...args) => {
        return {
          type: 'grouping sets',
          args
        }
      }
    }
  }
};

const { buildTaggedTemplate: buildTaggedTemplate$5 } = libUtil;

const dateToYYYYMMDD = d => [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
].join('-');

const build$1 = (ctx, arg) => {
    // compiled expression string
    if (arg.exp) return arg.exp
    // tagged template argument
    if (arg.tag) return buildTaggedTemplate$5(ctx, arg.tag)
    // expression, subquery or fragment argument
    return ctx.build(arg.arg)
};

const unaryPre = op => ({
    minArgs: 1,
    maxArgs: 1,
    build: (ctx, args) => `(${op} ${build$1(ctx, args[0])})`
});

const unaryPost = op => ({
    minArgs: 1,
    maxArgs: 1,
    build: (ctx, args) => `(${build$1(ctx, args[0])} ${op})`
});

const unaryFunction = op => ({
    minArgs: 1,
    maxArgs: 1,
    build: (ctx, args) => `${op}(${build$1(ctx, args[0])})`
});

const binary = op => ({
    minArgs: 2,
    maxArgs: 2,
    build: (ctx, args) => `(${build$1(ctx, args[0])} ${op} ${build$1(ctx, args[1])})`
});

const dateBinary = op => ({
    minArgs: 2,
    maxArgs: 2,
    build: (ctx, args) => {
        const inDate = args[1].arg;
        if (typeof inDate.getMonth === 'function') {
            args[1].arg = dateToYYYYMMDD(inDate);
        }
        return `date(${build$1(ctx, args[0])}, 'YYYY-MM-DD') ${op} ${build$1(ctx, args[1])}`
    }
});


const ternary = (op1, op2) => ({
    minArgs: 3,
    maxArgs: 3,
    build: (ctx, args) =>
        `(${build$1(ctx, args[0])} ${op1} ${build$1(ctx, args[1])} ${op2} ${build$1(
            ctx,
            args[2]
        )})`
});

const nary = op => ({
    minArgs: 1,
    maxArgs: Number.MAX_SAFE_INTEGER,
    build: (ctx, args) => {
        if (args.length === 1) return build$1(ctx, args[0])
        let txt = '(';
        for (let i = 0; i < args.length; ++i) {
            if (i !== 0) txt += ` ${op} `;
            txt += build$1(ctx, args[i]);
        }
        return txt + ')'
    }
});

const naryFunction = fn => ({
    minArgs: 1,
    maxArgs: Number.MAX_SAFE_INTEGER,
    build: (ctx, args) => {
        let txt = `${fn}(`;
        for (let i = 0; i < args.length; ++i) {
            if (i !== 0) txt += `, `;
            txt += build$1(ctx, args[i]);
        }
        return txt + ')'
    }
});

const oneValue = {
    minArgs: 1,
    maxArgs: 1,
    build: (ctx, args) => build$1(ctx, args[0])
};

const compositeValue = {
    minArgs: 1,
    maxArgs: Number.MAX_SAFE_INTEGER,
    build: (ctx, args) => {
        if (args.length === 1) return build$1(ctx, args[0])
        let txt = '';
        for (let i = 0; i < args.length; ++i) {
            if (i !== 0) txt += ', ';
            txt += build$1(ctx, args[i]);
        }
        return args.length > 1 ? `(${txt})` : txt
    }
};

const buildValuesList = (ctx, values) => {
    if (values.length === 0) throw Error('Error: .in operation values list empty')
    let txt = '(';
    for (let i = 0; i < values.length; ++i) {
        if (i !== 0) txt += ', ';
        txt += ctx.build(values[i]);
    }
    return txt + ')'
};

const membership = op => ({
    minArgs: 2,
    maxArgs: 2,
    build: (ctx, [arg1, arg2]) =>
        `(${build$1(ctx, arg1)} ${op} ${Array.isArray(arg2.arg)
            ? buildValuesList(ctx, arg2.arg)
            : build$1(ctx, arg2)
        })`
});

const quantifiedComparison = op => ({
    minArgs: 2,
    maxArgs: 2,
    build: (ctx, args) => `(${build$1(ctx, args[0])} ${op}(${build$1(ctx, args[1])}))`
});

var util = {
    build: build$1,
    unaryFunction,
    unaryPre,
    unaryPost,
    binary,
    ternary,
    nary,
    naryFunction,
    oneValue,
    compositeValue,
    membership,
    quantifiedComparison,
    dateBinary
};

const {
    unaryPre: unaryPre$1,
    unaryPost: unaryPost$1,
    unaryFunction: unaryFunction$1,
    binary: binary$1,
    ternary: ternary$1,
    nary: nary$1,
    naryFunction: naryFunction$1,
    oneValue: oneValue$1,
    compositeValue: compositeValue$1,
    membership: membership$1,
    quantifiedComparison: quantifiedComparison$1,
    dateBinary: dateBinary$1
} = util;

// value
const value$1 = {
    arg: compositeValue$1,
    row: compositeValue$1,
    unknown: oneValue$1,
    boolean: oneValue$1,
    number: oneValue$1,
    string: oneValue$1,
    array: oneValue$1,
    json: oneValue$1,
    table: oneValue$1
};

// boolean
const boolean = {
    // logical
    and: nary$1('and'),
    or: nary$1('or'),
    not: unaryFunction$1('not'),
    // comparison
    isTrue: unaryPost$1('is true'),
    isNotTrue: unaryPost$1('is not true'),
    isFalse: unaryPost$1('is false'),
    isNotFalse: unaryPost$1('is not false'),
    isUnknown: unaryPost$1('is unknown'),
    isNotUnknown: unaryPost$1('is not unknown')
};

// comparison
const comparison = {
    // binary comparison
    eq: binary$1('='),
    neq: binary$1('<>'),
    lt: binary$1('<'),
    gt: binary$1('>'),
    lte: binary$1('<='),
    gte: binary$1('>='),
    // misc
    between: ternary$1('between', 'and'),
    isDistinctFrom: binary$1('is distinct from'),
    isNotDistinctFrom: binary$1('is not distinct from'),
    isNull: unaryPost$1('is null'),
    isNotNull: unaryPost$1('is not null'),
    in: membership$1('in'),
    notIn: membership$1('not in'),
    // quantified any
    eqAny: quantifiedComparison$1('= any'),
    neqAny: quantifiedComparison$1('<> any'),
    ltAny: quantifiedComparison$1('< any'),
    gtAny: quantifiedComparison$1('> any'),
    lteAny: quantifiedComparison$1('<= any'),
    gteAny: quantifiedComparison$1('>= any'),
    // quantified all
    eqAll: quantifiedComparison$1('= all'),
    neqAll: quantifiedComparison$1('<> all'),
    ltAll: quantifiedComparison$1('< all'),
    gtAll: quantifiedComparison$1('> all'),
    lteAll: quantifiedComparison$1('<= all'),
    gteAll: quantifiedComparison$1('>= all')
};

// dates
const dateComparison = {
    // dateEq: dateBinary('='),
    // dateNeq: dateBinary('<>'),
    dateLt: dateBinary$1('<'),
    dateGt: dateBinary$1('>'),
    dateLte: dateBinary$1('<='),
    dateGte: dateBinary$1('>=')
};

// math
const math = {
    add: binary$1('+'),
    sub: binary$1('-'),
    mul: binary$1('*'),
    div: binary$1('/'),
    mod: binary$1('%'),
    exp: binary$1('%'),
    sqrt: unaryPre$1('|/'),
    cbrt: unaryPre$1('||/'),
    fact: unaryPre$1('!!'),
    abs: unaryFunction$1('abs')
};

// string
const string = {
    like: binary$1('like'),
    notLike: binary$1('not like')
};

const array = {
    unnest: naryFunction$1('unnest')
};

var libExpression = {
    ...value$1,
    ...boolean,
    ...comparison,
    ...math,
    ...array,
    ...dateComparison,
    ...string
};

var expression = { expressions: libExpression };

// parameterizes given argument, function should be attached to ctx
function parameterize(arg) {
    if (arg === undefined) throw Error('Error: parameter is undefined')
    return `$${this.params.push(arg)}`
}

/** Escapes an argument for use in UNPARAMETERIZED queries. NOT SAFE AT ALL. */
const escape = arg => {
    if (arg === undefined) throw Error('Error: parameter is undefined')
    if (arg === null) return 'null'
    if (typeof arg === 'string') return escapeLiteral(arg)
    if (typeof arg === 'number') return '' + arg
    if (typeof arg === 'boolean') return '' + arg
    if (typeof arg === 'object') {
        if (Array.isArray(arg)) {
            return `array[${arg.map(e => escape(e)).join(', ')}]`
        } else {
            return escapeLiteral(JSON.stringify(arg))
        }
    }
    throw Error(`Invalid argument SQL argument of type '${typeof arg}'`, arg)
};

// from https://github.com/brianc/node-postgres/blob/eb076db5d47a29c19d3212feac26cd7b6d257a95/lib/client.js#L351
const escapeLiteral = str => {
    let hasBackslash = false;
    let escaped = "'";
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (c === "'") {
            escaped += c + c;
        } else if (c === '\\') {
            escaped += c + c;
            hasBackslash = true;
        } else {
            escaped += c;
        }
    }
    escaped += "'";
    if (hasBackslash === true) {
        escaped = ' E' + escaped;
    }
    return escaped
};

var parameterize_1 = {
    parameterize,
    escape
};

const { parameterize: parameterize$1, escape: escape$1 } = parameterize_1;

var dialectPostgres = {
  query: query_1$1,
  expression,
  parameterize: parameterize$1,
  escape: escape$1
};

const a = libCore({ dialect: dialectPostgres });
a.from = undefined;
var src = a;

function dbFactory(globals) {
  const g = globals || _g;
  const {
    tokenPost
  } = authFactory(g);
  let _listenerIndex = 0;
  const _listeners = {};

  function _runListeners(...params) {
    for (const cb of Object.values(_listeners)) {
      cb(...params);
    }
  }

  const dbEventListener = callback => {
    const currKey = '' + _listenerIndex++;
    _listeners[currKey] = callback;
    return () => {
      delete _listeners[currKey];
    };
  };

  const allCallback = async (trx, tableName, userAssociatedRecordsOnly) => {
    trx.count = "all";
    trx.tableName = tableName;
    if (userAssociatedRecordsOnly) trx.userAssociatedRecordsOnly = userAssociatedRecordsOnly;

    _runListeners(DB_STATUS.PENDING, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null);

    try {
      const res = await tokenPost(POST_TYPES.EASY_QB, trx);

      if (res.success) {
        _runListeners(DB_STATUS.SUCCESS, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null, res.data);

        return res.data;
      } else {
        _runListeners(DB_STATUS.ERROR, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null);

        return res;
      }
    } catch (error) {
      console.warn(error);

      _runListeners(DB_STATUS.ERROR, trx.type, EXECUTE_COUNT.ALL, tableName !== "untable" ? tableName : null);

      return [];
    }
  };

  const oneCallback = async (trx, tableName, userAssociatedRecordsOnly) => {
    trx.count = "one";
    trx.tableName = tableName;
    if (userAssociatedRecordsOnly) trx.userAssociatedRecordsOnly = userAssociatedRecordsOnly;

    _runListeners(DB_STATUS.PENDING, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null);

    try {
      const res = await tokenPost(POST_TYPES.EASY_QB, trx);

      if (res.success) {
        _runListeners(DB_STATUS.SUCCESS, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null, res.data);

        return res.data;
      } else {
        _runListeners(DB_STATUS.ERROR, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null);

        return res;
      }
    } catch (error) {
      console.warn(error);

      _runListeners(DB_STATUS.ERROR, trx.type, EXECUTE_COUNT.ONE, tableName !== "untable" ? tableName : null);

      return {};
    }
  };

  const db = (tableName, userAssociatedRecordsOnly) => {
    if (tableName && typeof tableName === "string") {
      return src({
        allCallback,
        oneCallback,
        userAssociatedRecordsOnly,
        tableName: tableName.toUpperCase()
      })(tableName.replace(/[^0-9a-zA-Z]/g, '_').toUpperCase());
    } else {
      return src({
        allCallback,
        oneCallback,
        userAssociatedRecordsOnly,
        tableName: "untable"
      })("untable");
    }
  };

  return {
    db,
    dbEventListener,
    e: src().e
  };
}

function EasybaseProvider({
  ebconfig,
  options
}) {
  const g = gFactory();
  const {
    tokenPost,
    tokenPostAttachment,
    signUp,
    setUserAttribute,
    getUserAttributes,
    isUserSignedIn,
    signIn,
    signOut,
    resetUserPassword,
    forgotPassword,
    forgotPasswordConfirm
  } = authFactory(g);
  const {
    Query,
    fullTableSize,
    tableTypes
  } = tableFactory(g);
  const {
    db,
    dbEventListener,
    e
  } = dbFactory(g);
  const {
    log
  } = utilsFactory(g);

  if (typeof ebconfig !== 'object' || ebconfig === null || ebconfig === undefined) {
    console.error("No ebconfig object passed. do `import ebconfig from \"./ebconfig.js\"` and pass it to the Easybase provider");
    return;
  } else if (!ebconfig.integration) {
    console.error("Invalid ebconfig object passed. Download ebconfig.js from Easybase.io and try again.");
    return;
  } // eslint-disable-next-line dot-notation


  const isIE = typeof document !== 'undefined' && !!document['documentMode'];

  if (isIE) {
    console.error("EASYBASE — easybasejs does not support Internet Explorer. Please use a different browser.");
  }

  g.options = _extends({}, options);
  g.integrationID = ebconfig.integration;
  g.ebconfig = ebconfig;

  if (g.ebconfig.tt && g.ebconfig.integration.split("-")[0].toUpperCase() !== "PROJECT") {
    g.mounted = false;
  } else {
    g.mounted = true;
  }

  g.instance = "Node";
  let _isFrameInitialized = true;
  let _frameConfiguration = {
    offset: 0,
    limit: 0
  };
  const _observedChangeStack = [];

  let _recordIdMap = new WeakMap();

  let _observableFrame = {
    observe: _ => {},
    unobserve: () => {}
  };
  let _frame = [];
  let isSyncing = false;

  function Frame(index) {
    if (typeof index === "number") {
      return _observableFrame[index];
    } else {
      return _observableFrame;
    }
  }

  const _recordIDExists = record => !!_recordIdMap.get(record);

  const configureFrame = options => {
    _frameConfiguration = _extends({}, _frameConfiguration);
    if (options.limit !== undefined) _frameConfiguration.limit = options.limit;
    if (options.offset !== undefined && options.offset >= 0) _frameConfiguration.offset = options.offset;
    if (options.tableName !== undefined) _frameConfiguration.tableName = options.tableName;
    _isFrameInitialized = false;
    return {
      message: "Successfully configured frame. Run sync() for changes to be shown in frame",
      success: true
    };
  };

  const currentConfiguration = () => _extends({}, _frameConfiguration);

  const deleteRecord = async options => {
    const _frameRecord = _frame.find(ele => deepEqual(ele, options.record));

    if (_frameRecord && _recordIdMap.get(_frameRecord)) {
      const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
        _id: _recordIdMap.get(_frameRecord),
        tableName: options.tableName
      });
      return {
        success: res.success,
        message: res.data
      };
    } else {
      try {
        const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
          record: options.record,
          tableName: options.tableName
        });
        return {
          success: res.success,
          message: res.data
        };
      } catch (error) {
        console.error("Easybase Error: deleteRecord failed ", error);
        return {
          success: false,
          message: "Easybase Error: deleteRecord failed " + error,
          errorCode: error.errorCode || undefined
        };
      }
    }
  };

  const addRecord = async options => {
    const defaultValues = {
      insertAtEnd: false,
      newRecord: {},
      tableName: undefined
    };

    const fullOptions = _extends({}, defaultValues, options);

    try {
      const res = await tokenPost(POST_TYPES.SYNC_INSERT, fullOptions);
      return {
        message: res.data,
        success: res.success
      };
    } catch (error) {
      console.error("Easybase Error: addRecord failed ", error);
      return {
        message: "Easybase Error: addRecord failed " + error,
        success: false,
        errorCode: error.errorCode || undefined
      };
    }
  }; // Only allow the deletion of one element at a time
  // First handle shifting of the array size. Then iterate


  const sync = async () => {
    const _realignFrames = newData => {
      let isNewDataTheSame = true;

      if (newData.length !== _frame.length) {
        isNewDataTheSame = false;
      } else {
        for (let i = 0; i < newData.length; i++) {
          const newDataNoId = _extends({}, newData[i]);

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

        _observableFrame.observe(allChanges => {
          allChanges.forEach(change => {
            _observedChangeStack.push({
              type: change.type,
              path: change.path,
              value: change.value,
              _id: _recordIdMap.get(_frame[Number(change.path[0])]) // Not bringing change.object or change.oldValue

            });

            log(JSON.stringify({
              type: change.type,
              path: change.path,
              value: change.value,
              _id: _recordIdMap.get(_frame[Number(change.path[0])]) // Not bringing change.object or change.oldValue

            }));
          });
        });
      }
    };

    if (isSyncing) {
      return {
        success: false,
        message: "Easybase Error: the provider is currently syncing, use 'await sync()' before calling sync() again"
      };
    }

    isSyncing = true;

    if (_isFrameInitialized) {
      if (_observedChangeStack.length > 0) {
        log("Stack change: ", _observedChangeStack);
        const res = await tokenPost(POST_TYPES.SYNC_STACK, _extends({
          stack: _observedChangeStack
        }, _frameConfiguration));

        if (res.success) {
          _observedChangeStack.length = 0;
        }
      }
    }

    try {
      const res = await tokenPost(POST_TYPES.GET_FRAME, _frameConfiguration); // Check if the array recieved from db is the same as frame
      // If not, update it and send useFrameEffect

      if (res.success === false) {
        console.error(res.data);
        isSyncing = false;
        return {
          success: false,
          message: "" + res.data
        };
      } else {
        _isFrameInitialized = true;

        _realignFrames(res.data);

        isSyncing = false;
        return {
          message: 'Success. Call frame for data',
          success: true
        };
      }
    } catch (error) {
      console.error("Easybase Error: get failed ", error);
      isSyncing = false;
      return {
        success: false,
        message: "Easybase Error: get failed " + error,
        errorCode: error.errorCode || undefined
      };
    }
  };

  const updateRecordImage = async options => {
    const res = await _updateRecordAttachment(options, "image");
    return res;
  };

  const updateRecordVideo = async options => {
    const res = await _updateRecordAttachment(options, "video");
    return res;
  };

  const updateRecordFile = async options => {
    const res = await _updateRecordAttachment(options, "file");
    return res;
  };

  const _updateRecordAttachment = async (options, type) => {
    const _frameRecord = _frame.find(ele => deepEqual(ele, options.record));

    if (_frameRecord === undefined || !_recordIDExists(_frameRecord)) {
      log("Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment.");
      return {
        success: false,
        message: "Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment."
      };
    }

    const ext = options.attachment.name.split(".").pop().toLowerCase();
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

    function isFileFromURI(f) {
      return f.uri !== undefined;
    }

    const formData = new FormData();

    if (isFileFromURI(options.attachment)) {
      formData.append("file", options.attachment);
      formData.append("name", options.attachment.name);
    } else {
      formData.append("file", options.attachment);
      formData.append("name", options.attachment.name);
    }

    const customHeaders = {
      'Eb-upload-type': type,
      'Eb-column-name': options.columnName,
      'Eb-record-id': _recordIdMap.get(_frameRecord),
      'Eb-table-name': options.tableName
    };
    const res = await tokenPostAttachment(formData, customHeaders);
    await sync();
    return {
      message: res.data,
      success: res.success
    };
  };

  const c = {
    /** +++ Will be deprecated */
    configureFrame,
    addRecord,
    deleteRecord,
    sync,
    Frame,
    currentConfiguration,

    /** --- */
    updateRecordImage,
    updateRecordVideo,
    updateRecordFile,
    fullTableSize,
    tableTypes,
    Query,
    isUserSignedIn,
    signIn,
    signOut,
    signUp,
    resetUserPassword,
    setUserAttribute,
    getUserAttributes,
    db,
    dbEventListener,
    e,
    forgotPassword,
    forgotPasswordConfirm
  };
  return c;
}

const generateBareUrl = (type, integrationID) => `https://api.easybase.io/${type}/${integrationID}`;

const isBadInt = my_int => my_int !== undefined && my_int !== null && Math.floor(my_int) !== my_int;

const isBadString = my_string => my_string !== undefined && my_string !== null && typeof my_string !== "string";

const isBadIntegrationID = my_string => my_string === undefined || my_string === null || typeof my_string !== "string";

const isBadObject = my_obj => my_obj !== undefined && my_obj !== null && typeof my_obj !== "object";

const isBadBool = my_bool => my_bool !== undefined && my_bool !== null && typeof my_bool !== "boolean";
/**
 *
 * @param {GetOptions} options GetOptions.
 * @returns {Promise<Array>} Array of records.
 *
 */


function get(options) {
  const defaultOptions = {
    integrationID: "",
    offset: undefined,
    limit: undefined,
    authentication: undefined,
    customQuery: undefined
  };

  const {
    integrationID,
    offset,
    limit,
    authentication,
    customQuery
  } = _extends({}, defaultOptions, options);

  if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
  if (isBadInt(offset)) throw new Error("offset must be an integer");
  if (isBadInt(limit)) throw new Error("limit must be an integer");
  if (isBadString(authentication)) throw new Error("authentication must be a string or null");
  if (isBadObject(customQuery)) throw new Error("customQuery must be an object or null");
  return new Promise((resolve, reject) => {
    try {
      let fetch_body = {};
      if (typeof customQuery === "object") fetch_body = _extends({}, customQuery);
      if (offset !== undefined) fetch_body.offset = offset;
      if (limit !== undefined) fetch_body.limit = limit;
      if (authentication !== undefined) fetch_body.authentication = authentication;
      fetch(generateBareUrl('get', integrationID), {
        method: "POST",
        body: JSON.stringify(fetch_body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(resData => {
        if ({}.hasOwnProperty.call(resData, 'ErrorCode')) {
          console.error(resData.message);
          resolve([resData.message]);
        } else resolve(resData);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 *
 * @param {PostOptions} options PostOptions
 * @returns {Promise<String>} Post status.
 *
 */

function post(options) {
  const defaultValues = {
    integrationID: "",
    newRecord: undefined,
    authentication: undefined,
    insertAtEnd: undefined
  };

  const {
    integrationID,
    newRecord,
    authentication,
    insertAtEnd
  } = _extends({}, defaultValues, options);

  if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
  if (isBadObject(newRecord)) throw new Error("newRecord is required and must be a string");
  if (isBadString(authentication)) throw new Error("authentication must be a string or null");
  if (isBadBool(insertAtEnd)) throw new Error("insertAtEnd must be a boolean or null");
  return new Promise((resolve, reject) => {
    try {
      const fetch_body = _extends({}, newRecord);

      if (authentication !== undefined) fetch_body.authentication = authentication;
      if (insertAtEnd !== undefined) fetch_body.insertAtEnd = insertAtEnd;
      fetch(generateBareUrl('post', integrationID), {
        method: "POST",
        body: JSON.stringify(fetch_body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(resData => {
        if ({}.hasOwnProperty.call(resData, 'ErrorCode')) console.error(resData.message);
        resolve(resData);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 *
 * @param {UpdateOptions} options UpdateOptions
 * @returns {Promise<String>} Update status.
 */

function update$3(options) {
  const defaultValues = {
    integrationID: "",
    updateValues: undefined,
    authentication: undefined,
    customQuery: undefined
  };

  const {
    integrationID,
    updateValues,
    authentication,
    customQuery
  } = _extends({}, defaultValues, options);

  if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
  if (isBadObject(updateValues) || updateValues === undefined) throw new Error("updateValues is required and must be a string");
  if (isBadString(authentication)) throw new Error("authentication must be a string or null");
  if (isBadObject(customQuery)) throw new Error("customQuery must be an object or null");
  return new Promise((resolve, reject) => {
    try {
      const fetch_body = _extends({
        updateValues
      }, customQuery);

      if (authentication !== undefined) fetch_body.authentication = authentication;
      fetch(generateBareUrl('update', integrationID), {
        method: "POST",
        body: JSON.stringify(fetch_body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(resData => {
        if ({}.hasOwnProperty.call(resData, 'ErrorCode')) console.error(resData.message);
        resolve(resData.message);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 *
 * @param {DeleteOptions} options DeleteOptions
 * @return {Promise<String>} Delete status.
 */

function Delete(options) {
  const defaultValues = {
    integrationID: "",
    authentication: undefined,
    customQuery: undefined
  };

  const {
    integrationID,
    authentication,
    customQuery
  } = _extends({}, defaultValues, options);

  if (isBadIntegrationID(integrationID)) throw new Error("integrationID is required and must be a string");
  if (isBadString(authentication)) throw new Error("authentication must be a string or null");
  if (isBadObject(customQuery)) throw new Error("customQuery must be an object or null");
  return new Promise((resolve, reject) => {
    try {
      const fetch_body = _extends({}, customQuery);

      if (authentication !== undefined) fetch_body.authentication = authentication;
      fetch(generateBareUrl('delete', integrationID), {
        method: "POST",
        body: JSON.stringify(fetch_body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(resData => {
        if ({}.hasOwnProperty.call(resData, 'ErrorCode')) console.error(resData.message);
        resolve(resData.message);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 * @async
 * Call a cloud function, created in Easybase interface.
 * @param {string} route Route as detailed in Easybase. Found under 'Deploy'. Will be in the form of ####...####-function-name.
 * @param {Record<string, any>} postBody Optional object to pass as the body of the POST request. This object will available in your cloud function's event.body.
 * @return {Promise<string>} Response from your cloud function. Detailed with a call to 'return context.succeed("RESPONSE")'.
 */

async function callFunction(route, postBody) {
  const res = await fetch(generateBareUrl('function', route.split("/").pop()), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postBody) || ""
  });
  const rawDataText = await res.text();
  return rawDataText;
}

export { Delete, EasybaseProvider, callFunction, get, post, update$3 as update };
//# sourceMappingURL=index.modern.js.map

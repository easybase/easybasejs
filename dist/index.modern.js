import axios from 'axios';
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
})(POST_TYPES || (POST_TYPES = {}));

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
  const {
    generateBareUrl,
    generateAuthBody,
    log
  } = utilsFactory(globals);
  const g = globals || _g;

  const initAuth = async () => {
    g.session = Math.floor(100000000 + Math.random() * 900000000);
    log(`Handshaking on instance`);

    try {
      const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
        version: g.ebconfig.version,
        tt: g.ebconfig.tt,
        session: g.session,
        isNode: true
      }, {
        headers: {
          'Eb-Post-Req': POST_TYPES.HANDSHAKE
        }
      });

      if (res.data.token) {
        g.token = res.data.token;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const tokenPost = async (postType, body) => {
    try {
      const res = await axios.post(generateBareUrl("REACT", g.integrationID), _extends({
        _auth: generateAuthBody()
      }, body), {
        headers: {
          'Eb-Post-Req': postType
        }
      });

      if ({}.hasOwnProperty.call(res.data, 'ErrorCode') || {}.hasOwnProperty.call(res.data, 'code')) {
        if (res.data.code === "JWT EXPIRED") {
          await initAuth();
          return tokenPost(postType, body);
        }

        return {
          success: false,
          data: res.data.body
        };
      } else {
        return {
          success: res.data.success,
          data: res.data.body
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error
      };
    }
  };

  const tokenPostAttachment = async (formData, customHeaders) => {
    const regularAuthbody = generateAuthBody();
    const attachmentAuth = {
      'Eb-token': regularAuthbody.token,
      'Eb-token-time': regularAuthbody.token_time,
      'Eb-now': regularAuthbody.now
    };

    try {
      const res = await axios.post(generateBareUrl("REACT", g.integrationID), formData, {
        headers: _extends({
          'Eb-Post-Req': POST_TYPES.UPLOAD_ATTACHMENT,
          'Content-Type': 'multipart/form-data'
        }, customHeaders, attachmentAuth)
      });

      if ({}.hasOwnProperty.call(res.data, 'ErrorCode') || {}.hasOwnProperty.call(res.data, 'code')) {
        if (res.data.code === "JWT EXPIRED") {
          await initAuth();
          return tokenPostAttachment(formData, customHeaders);
        }

        return {
          success: false,
          data: res.data.body
        };
      } else {
        return {
          success: res.data.success,
          data: res.data.body
        };
      }
    } catch (error) {
      return {
        success: false,
        data: error
      };
    }
  };

  return {
    initAuth,
    tokenPost,
    tokenPostAttachment
  };
}

function EasybaseProvider({
  ebconfig,
  options
}) {
  const g = gFactory();
  const {
    initAuth,
    tokenPost: tokenPostGeneric,
    tokenPostAttachment: tokenPostAttachmentGeneric
  } = authFactory(g);

  const tokenPost = async (postType, body) => {
    if (!_mounted) {
      await mount();
    }

    return tokenPostGeneric(postType, body);
  };

  const tokenPostAttachment = async (formData, customHeaders) => {
    if (!_mounted) {
      await mount();
    }

    return tokenPostAttachmentGeneric(formData, customHeaders);
  };

  const {
    log
  } = utilsFactory(g);
  let _mounted = false;

  if (typeof ebconfig !== 'object' || ebconfig === null || ebconfig === undefined) {
    console.error("No ebconfig object passed. do `import ebconfig from \"ebconfig.json\"` and pass it to the Easybase provider");
    return;
  } else if (!ebconfig.integration || !ebconfig.tt) {
    console.error("Invalid ebconfig object passed. Download ebconfig.json from Easybase.io and try again.");
    return;
  } // eslint-disable-next-line dot-notation


  const isIE = typeof document !== 'undefined' && !!document['documentMode'];

  if (isIE) {
    console.error("EASYBASE — easybase-react does not support Internet Explorer. Please use a different browser.");
  }

  g.options = _extends({}, options);
  g.integrationID = ebconfig.integration;
  g.ebconfig = ebconfig;

  const mount = async () => {
    const t1 = Date.now();
    log("mounting...");
    await initAuth();
    _mounted = true;
    const res = await tokenPost(POST_TYPES.VALID_TOKEN);
    const elapsed = Date.now() - t1;

    if (res.success) {
      log("Valid auth initiation in " + elapsed + "ms");
    }
  };

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

  const Query = async options => {
    const defaultOptions = {
      queryName: ""
    };

    const fullOptions = _extends({}, defaultOptions, options);

    try {
      const res = await tokenPost(POST_TYPES.GET_QUERY, fullOptions);
      return res.data;
    } catch (error) {
      return [];
    }
  };

  const configureFrame = options => {
    if (options.limit === _frameConfiguration.limit && options.offset === _frameConfiguration.offset) {
      return {
        message: "Frame parameters are the same as the previous configuration.",
        success: true
      };
    }

    _frameConfiguration = _extends({}, _frameConfiguration);
    if (options.limit !== undefined) _frameConfiguration.limit = options.limit;
    if (options.offset !== undefined && options.offset >= 0) _frameConfiguration.offset = options.offset;
    _isFrameInitialized = false;
    return {
      message: "Successfully configured frame. Run sync() for changes to be shown in frame",
      success: true
    };
  };

  const currentConfiguration = () => _extends({}, _frameConfiguration);

  const addRecord = async options => {
    const defaultValues = {
      insertAtEnd: false,
      newRecord: {}
    };

    const fullOptions = _extends({}, defaultValues, options);

    try {
      const res = await tokenPost(POST_TYPES.SYNC_INSERT, fullOptions);
      return {
        message: res.data,
        success: res.success
      };
    } catch (err) {
      console.error("Easybase Error: addRecord failed ", err);
      return {
        message: "Easybase Error: addRecord failed " + err,
        success: false,
        error: err
      };
    }
  };

  const deleteRecord = async record => {
    const _frameRecord = _frame.find(ele => deepEqual(ele, record));

    if (_frameRecord && _recordIdMap.get(_frameRecord)) {
      const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
        _id: _recordIdMap.get(_frameRecord)
      });
      return {
        success: res.success,
        message: res.data
      };
    } else {
      try {
        const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
          record
        });
        return {
          success: res.success,
          message: res.data
        };
      } catch (err) {
        console.error("Easybase Error: deleteRecord failed ", err);
        return {
          success: false,
          message: "Easybase Error: deleteRecord failed " + err,
          error: err
        };
      }
    }
  };

  const fullTableSize = async () => {
    const res = await tokenPost(POST_TYPES.TABLE_SIZE, {});

    if (res.success) {
      return res.data;
    } else {
      return 0;
    }
  };

  const tableTypes = async () => {
    const res = await tokenPost(POST_TYPES.COLUMN_TYPES, {});

    if (res.success) {
      return res.data;
    } else {
      return {};
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
    const {
      offset,
      limit
    } = _frameConfiguration;

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
      }); // Check if the array recieved from db is the same as frame
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
    } catch (err) {
      console.error("Easybase Error: get failed ", err);
      isSyncing = false;
      return {
        success: false,
        message: "Easybase Error: get failed " + err,
        error: err
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
      'Eb-record-id': _recordIdMap.get(_frameRecord)
    };
    const res = await tokenPostAttachment(formData, customHeaders);
    await sync();
    return {
      message: res.data,
      success: res.success
    };
  };

  const c = {
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
      let axios_body = {};
      if (typeof customQuery === "object") axios_body = _extends({}, customQuery);
      if (offset !== undefined) axios_body.offset = offset;
      if (limit !== undefined) axios_body.limit = limit;
      if (authentication !== undefined) axios_body.authentication = authentication;
      axios.post(generateBareUrl('get', integrationID), axios_body).then(res => {
        if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
          console.error(res.data.message);
          resolve([res.data.message]);
        } else resolve(res.data);
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
      const axios_body = _extends({}, newRecord);

      if (authentication !== undefined) axios_body.authentication = authentication;
      if (insertAtEnd !== undefined) axios_body.insertAtEnd = insertAtEnd;
      axios.post(generateBareUrl('post', integrationID), axios_body).then(res => {
        if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) console.error(res.data.message);
        resolve(res.data.message);
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

function update(options) {
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
      const axios_body = _extends({
        updateValues
      }, customQuery);

      if (authentication !== undefined) axios_body.authentication = authentication;
      axios.post(generateBareUrl('update', integrationID), axios_body).then(res => {
        if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) console.error(res.data.message);
        resolve(res.data.message);
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
      const axios_body = _extends({}, customQuery);

      if (authentication !== undefined) axios_body.authentication = authentication;
      axios.post(generateBareUrl('delete', integrationID), axios_body).then(res => {
        if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) console.error(res.data.message);
        resolve(res.data.message);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { Delete, EasybaseProvider, get, post, update };
//# sourceMappingURL=index.modern.js.map

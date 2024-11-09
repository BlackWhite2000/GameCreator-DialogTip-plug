














var OpenAPI;
(function (OpenAPI) {
    var AnimationUtils = (function () {
        function AnimationUtils() {
        }
        AnimationUtils.setObjectData = function (object_1, object_2) {
            Object.assign(object_2, {
                x: object_1.x,
                y: object_1.y,
                scaleX: object_1.scaleX,
                scaleY: object_1.scaleY,
                dpX: object_1.dpX,
                dpY: object_1.dpY,
                dpZ: object_1.dpZ,
                dpScaleX: object_1.dpScaleX,
                dpScaleY: object_1.dpScaleY,
                rotation1: object_1.rotation1,
                opacity: object_1.opacity,
            });
        };
        AnimationUtils.setAnimation = function (object, aniID, complete) {
            var _this = this;
            var ui = new UIRoot();
            var ani = new GCAnimation();
            this.setObjectData(object, ui);
            object.parent.addChild(ui);
            ui.addChild(object);
            ani.id = aniID;
            ani.target = object;
            ani.play();
            ani.once(GCAnimation.PLAY_COMPLETED, this, function (ani, object, ui) {
                ani.dispose();
                ui.parent.addChild(object);
                _this.setObjectData(ui, object);
                ui.dispose();
                if (complete) {
                    complete.run();
                }
            }, [ani, object, ui]);
        };
        AnimationUtils.setImageAnimation = function (taskName, object, aniID, complete) {
            var _this = this;
            if (!object)
                return;
            if (taskName) {
                new SyncTask(taskName, function () {
                    _this.setAnimation(object, aniID, Callback.New(function () {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run();
                        }
                    }, _this));
                });
            }
            else {
                this.setAnimation(object, aniID, Callback.New(function () {
                    if (complete) {
                        complete.run();
                    }
                }, this));
            }
        };
        AnimationUtils.setUIAnimation = function (taskName, object, aniID, complete) {
            var _this = this;
            if (!object)
                return;
            if (taskName) {
                new SyncTask(taskName, function () {
                    _this.setAnimation(object, aniID, Callback.New(function () {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run();
                        }
                    }, _this));
                });
            }
            else {
                this.setAnimation(object, aniID, Callback.New(function () {
                    if (complete) {
                        complete.run();
                    }
                }, this));
            }
        };
        AnimationUtils.setSceneObjectAnimation = function (taskName, object, aniID, loop, isHit, complete) {
            var _this = this;
            if (loop === void 0) { loop = false; }
            if (isHit === void 0) { isHit = false; }
            if (!object)
                return;
            if (taskName) {
                new SyncTask(taskName, function () {
                    var soAni = object.playAnimation(aniID, loop, isHit);
                    soAni.once(GCAnimation.PLAY_COMPLETED, _this, function () {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run();
                        }
                    });
                });
            }
            else {
                var soAni = object.playAnimation(aniID, loop, isHit);
                soAni.once(GCAnimation.PLAY_COMPLETED, this, function () {
                    if (complete) {
                        complete.run();
                    }
                });
            }
        };
        return AnimationUtils;
    }());
    OpenAPI.AnimationUtils = AnimationUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var ArrayUtils = (function () {
        function ArrayUtils() {
        }
        ArrayUtils.chunk = function (arr, size) {
            if (!Number.isInteger(size) || size <= 0) {
                throw new Error('Size must be an integer greater than zero.');
            }
            var chunkLength = Math.ceil(arr.length / size);
            var result = Array(chunkLength);
            for (var index = 0; index < chunkLength; index++) {
                var start = index * size;
                var end = start + size;
                result[index] = arr.slice(start, end);
            }
            return result;
        };
        ArrayUtils.compact = function (arr) {
            var result = [];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var item = arr_1[_i];
                if (item) {
                    result.push(item);
                }
            }
            return result;
        };
        ArrayUtils.countBy = function (arr, mapper) {
            var _a;
            var result = {};
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var item = arr_2[_i];
                var key = mapper(item);
                result[key] = ((_a = result[key]) !== null && _a !== void 0 ? _a : 0) + 1;
            }
            return result;
        };
        ArrayUtils.difference = function (firstArr, secondArr) {
            var secondSet = new Set(secondArr);
            return firstArr.filter(function (item) { return !secondSet.has(item); });
        };
        ArrayUtils.differenceBy = function (firstArr, secondArr, mapper) {
            var mappedSecondSet = new Set(secondArr.map(function (item) { return mapper(item); }));
            return firstArr.filter(function (item) {
                return !mappedSecondSet.has(mapper(item));
            });
        };
        ArrayUtils.differenceWith = function (firstArr, secondArr, areItemsEqual) {
            return firstArr.filter(function (firstItem) {
                return secondArr.every(function (secondItem) {
                    return !areItemsEqual(firstItem, secondItem);
                });
            });
        };
        ArrayUtils.drop = function (arr, itemsCount) {
            return arr.slice(itemsCount);
        };
        ArrayUtils.dropRight = function (arr, itemsCount) {
            return arr.slice(0, -itemsCount);
        };
        ArrayUtils.dropRightWhile = function (arr, canContinueDropping) {
            var reversed = arr.slice().reverse();
            var dropped = this.dropWhile(reversed, canContinueDropping);
            return dropped.slice().reverse();
        };
        ArrayUtils.dropWhile = function (arr, canContinueDropping) {
            var dropEndIndex = arr.findIndex(function (item) { return !canContinueDropping(item); });
            if (dropEndIndex === -1) {
                return [];
            }
            return arr.slice(dropEndIndex);
        };
        ArrayUtils.fill = function (arr, value, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = arr.length; }
            start = Math.max(start, 0);
            end = Math.min(end, arr.length);
            for (var i = start; i < end; i++) {
                arr[i] = value;
            }
            return arr;
        };
        ArrayUtils.flatten = function (arr, depth) {
            if (depth === void 0) { depth = 1; }
            var result = [];
            var flooredDepth = Math.floor(depth);
            var recursive = function (arr, currentDepth) {
                for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
                    var item = arr_3[_i];
                    if (Array.isArray(item) && currentDepth < flooredDepth) {
                        recursive(item, currentDepth + 1);
                    }
                    else {
                        result.push(item);
                    }
                }
            };
            recursive(arr, 0);
            return result;
        };
        ArrayUtils.forEachRight = function (arr, callback) {
            for (var i = arr.length - 1; i >= 0; i--) {
                var element = arr[i];
                callback(element, i, arr);
            }
        };
        ArrayUtils.groupBy = function (arr, getKeyFromItem) {
            var result = {};
            for (var _i = 0, arr_4 = arr; _i < arr_4.length; _i++) {
                var item = arr_4[_i];
                var key = getKeyFromItem(item);
                if (result[key] == null) {
                    result[key] = [];
                }
                result[key].push(item);
            }
            return result;
        };
        ArrayUtils.head = function (arr) {
            return arr[0];
        };
        ArrayUtils.intersection = function (firstArr, secondArr) {
            var secondSet = new Set(secondArr);
            return firstArr.filter(function (item) {
                return secondSet.has(item);
            });
        };
        ArrayUtils.intersectionBy = function (firstArr, secondArr, mapper) {
            var mappedSecondSet = new Set(secondArr.map(mapper));
            return firstArr.filter(function (item) { return mappedSecondSet.has(mapper(item)); });
        };
        ArrayUtils.intersectionWith = function (firstArr, secondArr, areItemsEqual) {
            return firstArr.filter(function (firstItem) {
                return secondArr.some(function (secondItem) {
                    return areItemsEqual(firstItem, secondItem);
                });
            });
        };
        ArrayUtils.keyBy = function (arr, getKeyFromItem) {
            var result = {};
            for (var _i = 0, arr_5 = arr; _i < arr_5.length; _i++) {
                var item = arr_5[_i];
                var key = getKeyFromItem(item);
                result[key] = item;
            }
            return result;
        };
        ArrayUtils.last = function (arr) {
            return arr[arr.length - 1];
        };
        ArrayUtils.maxBy = function (items, getValue) {
            var maxElement = items[0];
            var max = -Infinity;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var element = items_1[_i];
                var value = getValue(element);
                if (value > max) {
                    max = value;
                    maxElement = element;
                }
            }
            return maxElement;
        };
        ArrayUtils.minBy = function (items, getValue) {
            var minElement = items[0];
            var min = Infinity;
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var element = items_2[_i];
                var value = getValue(element);
                if (value < min) {
                    min = value;
                    minElement = element;
                }
            }
            return minElement;
        };
        ArrayUtils.orderBy = function (collection, keys, orders) {
            var compareValues = function (a, b, order) {
                if (a < b) {
                    return order === 'asc' ? -1 : 1;
                }
                if (a > b) {
                    return order === 'asc' ? 1 : -1;
                }
                return 0;
            };
            var effectiveOrders = keys.map(function (_, index) { return orders[index] || orders[orders.length - 1]; });
            return collection.slice().sort(function (a, b) {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var order = effectiveOrders[i];
                    var result = compareValues(a[key], b[key], order);
                    if (result !== 0) {
                        return result;
                    }
                }
                return 0;
            });
        };
        ArrayUtils.partition = function (arr, isInTruthy) {
            var truthy = [];
            var falsy = [];
            for (var _i = 0, arr_6 = arr; _i < arr_6.length; _i++) {
                var item = arr_6[_i];
                if (isInTruthy(item)) {
                    truthy.push(item);
                }
                else {
                    falsy.push(item);
                }
            }
            return [truthy, falsy];
        };
        ArrayUtils.sample = function (arr) {
            var randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        };
        ArrayUtils.sampleSize = function (array, size) {
            if (size > array.length) {
                throw new Error('Size must be less than or equal to the length of array.');
            }
            var result = new Array(size);
            var selected = new Set();
            for (var step = array.length - size, resultIndex = 0; step < array.length; step++, resultIndex++) {
                var index = OpenAPI.MathUtils.randomInt(0, step + 1);
                if (selected.has(index)) {
                    index = step;
                }
                selected.add(index);
                result[resultIndex] = array[index];
            }
            return result;
        };
        ArrayUtils.shuffle = function (arr) {
            var _a;
            var result = arr.slice();
            for (var i = result.length - 1; i >= 1; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [result[j], result[i]], result[i] = _a[0], result[j] = _a[1];
            }
            return result;
        };
        ArrayUtils.tail = function (arr) {
            var len = arr.length;
            if (len <= 1) {
                return [];
            }
            var result = new Array(len - 1);
            for (var i = 1; i < len; i++) {
                result[i - 1] = arr[i];
            }
            return result;
        };
        ArrayUtils.take = function (arr, count) {
            return arr.slice(0, count);
        };
        ArrayUtils.takeRight = function (arr, count) {
            if (count === 0) {
                return [];
            }
            return arr.slice(-count);
        };
        ArrayUtils.takeRightWhile = function (arr, shouldContinueTaking) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if (!shouldContinueTaking(arr[i])) {
                    return arr.slice(i + 1);
                }
            }
            return arr.slice();
        };
        ArrayUtils.takeWhile = function (arr, shouldContinueTaking) {
            var result = [];
            for (var _i = 0, arr_7 = arr; _i < arr_7.length; _i++) {
                var item = arr_7[_i];
                if (!shouldContinueTaking(item)) {
                    break;
                }
                result.push(item);
            }
            return result;
        };
        ArrayUtils.union = function (arr1, arr2) {
            return this.uniq(arr1.concat(arr2));
        };
        ArrayUtils.unionBy = function (arr1, arr2, mapper) {
            var map = new Map();
            for (var _i = 0, _a = __spreadArray(__spreadArray([], arr1, true), arr2, true); _i < _a.length; _i++) {
                var item = _a[_i];
                var key = mapper(item);
                if (!map.has(key)) {
                    map.set(key, item);
                }
            }
            return Array.from(map.values());
        };
        ArrayUtils.unionWith = function (arr1, arr2, areItemsEqual) {
            return this.uniqWith(arr1.concat(arr2), areItemsEqual);
        };
        ArrayUtils.uniq = function (arr) {
            return Array.from(new Set(arr));
        };
        ArrayUtils.uniqBy = function (arr, mapper) {
            var map = new Map();
            for (var _i = 0, arr_8 = arr; _i < arr_8.length; _i++) {
                var item = arr_8[_i];
                var key = mapper(item);
                if (!map.has(key)) {
                    map.set(key, item);
                }
            }
            return Array.from(map.values());
        };
        ArrayUtils.uniqWith = function (arr, areItemsEqual) {
            var result = [];
            var _loop_2 = function (item) {
                var isUniq = result.every(function (v) { return !areItemsEqual(v, item); });
                if (isUniq) {
                    result.push(item);
                }
            };
            for (var _i = 0, arr_9 = arr; _i < arr_9.length; _i++) {
                var item = arr_9[_i];
                _loop_2(item);
            }
            return result;
        };
        ArrayUtils.unzip = function (zipped) {
            var maxLen = 0;
            for (var i = 0; i < zipped.length; i++) {
                if (zipped[i].length > maxLen) {
                    maxLen = zipped[i].length;
                }
            }
            var result = new Array(maxLen);
            for (var i = 0; i < maxLen; i++) {
                result[i] = new Array(zipped.length);
                for (var j = 0; j < zipped.length; j++) {
                    result[i][j] = zipped[j][i];
                }
            }
            return result;
        };
        ArrayUtils.unzipWith = function (target, iteratee) {
            var maxLength = Math.max.apply(Math, target.map(function (innerArray) { return innerArray.length; }));
            var result = new Array(maxLength);
            for (var i = 0; i < maxLength; i++) {
                var group = new Array(target.length);
                for (var j = 0; j < target.length; j++) {
                    group[j] = target[j][i];
                }
                result[i] = iteratee.apply(void 0, group);
            }
            return result;
        };
        ArrayUtils.without = function (array) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var valuesSet = new Set(values);
            return array.filter(function (item) { return !valuesSet.has(item); });
        };
        ArrayUtils.xor = function (arr1, arr2) {
            return this.difference(this.union(arr1, arr2), this.intersection(arr1, arr2));
        };
        ArrayUtils.xorBy = function (arr1, arr2, mapper) {
            var union = this.unionBy(arr1, arr2, mapper);
            var intersection = this.intersectionBy(arr1, arr2, mapper);
            return this.differenceBy(union, intersection, mapper);
        };
        ArrayUtils.xorWith = function (arr1, arr2, areElementsEqual) {
            var union = this.unionWith(arr1, arr2, areElementsEqual);
            var intersection = this.intersectionWith(arr1, arr2, areElementsEqual);
            return this.differenceWith(union, intersection, areElementsEqual);
        };
        ArrayUtils.zip = function () {
            var arrs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arrs[_i] = arguments[_i];
            }
            var result = [];
            var maxIndex = Math.max.apply(Math, arrs.map(function (x) { return x.length; }));
            for (var i = 0; i < maxIndex; i++) {
                var element = [];
                for (var _a = 0, arrs_1 = arrs; _a < arrs_1.length; _a++) {
                    var arr = arrs_1[_a];
                    element.push(arr[i]);
                }
                result.push(element);
            }
            return result;
        };
        ArrayUtils.zipObject = function (keys, values) {
            var result = {};
            for (var i = 0; i < keys.length; i++) {
                result[keys[i]] = values[i];
            }
            return result;
        };
        ArrayUtils.zipWith = function (arr1) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var arrs = __spreadArray([arr1], rest.slice(0, -1), true);
            var combine = rest[rest.length - 1];
            var result = [];
            var maxIndex = Math.max.apply(Math, arrs.map(function (arr) { return arr.length; }));
            var _loop_3 = function (i) {
                var elements = arrs.map(function (arr) { return arr[i]; });
                result.push(combine.apply(void 0, elements));
            };
            for (var i = 0; i < maxIndex; i++) {
                _loop_3(i);
            }
            return result;
        };
        return ArrayUtils;
    }());
    OpenAPI.ArrayUtils = ArrayUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var Clipper = (function () {
        function Clipper() {
        }
        Clipper.Init = function () {
            Clipper.ClipperLib = OpenAPI.Require.Init('clipper');
        };
        Clipper.toClipperPoints = function (points) {
            return points.map(function (point) { return ({ X: point.x, Y: point.y }); });
        };
        Clipper.polygonsIntersect = function (polygon1, polygon2) {
            var ClipperLib = OpenAPI.Clipper.ClipperLib;
            var clipper = new ClipperLib.Clipper();
            clipper.AddPath(polygon1, ClipperLib.PolyType.ptSubject, true);
            clipper.AddPath(polygon2, ClipperLib.PolyType.ptClip, true);
            var solution = new ClipperLib.Paths();
            clipper.Execute(ClipperLib.ClipType.ctIntersection, solution);
            return solution.length > 0;
        };
        return Clipper;
    }());
    OpenAPI.Clipper = Clipper;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var ConstantsUtils = (function () {
        function ConstantsUtils() {
        }
        ConstantsUtils.CASE_SPLIT_PATTERN = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
        return ConstantsUtils;
    }());
    OpenAPI.ConstantsUtils = ConstantsUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var CursorUtils = (function () {
        function CursorUtils() {
        }
        Object.defineProperty(CursorUtils, "cursorSystemStyleName", {
            get: function () {
                return OpenAPI.Method.cursorSystemStyleName;
            },
            enumerable: false,
            configurable: true
        });
        return CursorUtils;
    }());
    OpenAPI.CursorUtils = CursorUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var DateUtils = (function () {
        function DateUtils() {
        }
        DateUtils.dateToTimestamp = function (date) {
            return OpenAPI.Method.dateToTimestamp(date);
        };
        DateUtils.timestampToDate = function (timestamp, data_type) {
            if (data_type === void 0) { data_type = ''; }
            return OpenAPI.Method.timestampToDate(timestamp, data_type);
        };
        return DateUtils;
    }());
    OpenAPI.DateUtils = DateUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var AbortError = (function (_super) {
        __extends(AbortError, _super);
        function AbortError(message) {
            if (message === void 0) { message = 'The operation was aborted'; }
            var _this = _super.call(this, message) || this;
            _this.name = 'AbortError';
            return _this;
        }
        return AbortError;
    }(Error));
    OpenAPI.AbortError = AbortError;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var EventUtils = (function () {
        function EventUtils() {
        }
        EventUtils.eventPageName = function (eventPage) {
            return OpenAPI.Method.getFeDataMessage(eventPage);
        };
        return EventUtils;
    }());
    OpenAPI.EventUtils = EventUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var FunctionUtils = (function () {
        function FunctionUtils() {
        }
        FunctionUtils.debounce = function (func, debounceMs, _a) {
            var _b = _a === void 0 ? {} : _a, signal = _b.signal;
            var timeoutId = null;
            var debounced = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                }
                if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                    return;
                }
                timeoutId = setTimeout(function () {
                    func.apply(void 0, args);
                    timeoutId = null;
                }, debounceMs);
            };
            var onAbort = function () {
                debounced.cancel();
            };
            debounced.cancel = function () {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            };
            signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', onAbort, { once: true });
            return debounced;
        };
        FunctionUtils.noop = function () { };
        FunctionUtils.once = function (func) {
            var called = false;
            var cache;
            return function () {
                if (called) {
                    return cache;
                }
                var result = func();
                called = true;
                cache = result;
                return result;
            };
        };
        FunctionUtils.throttle = function (func, throttleMs) {
            var lastCallTime;
            var throttledFunction = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var now = Date.now();
                if (lastCallTime == null || now - lastCallTime >= throttleMs) {
                    lastCallTime = now;
                    func.apply(void 0, args);
                }
            };
            return throttledFunction;
        };
        return FunctionUtils;
    }());
    OpenAPI.FunctionUtils = FunctionUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var GC = (function () {
        function GC() {
        }
        GC.isCloudLog = function (text) {
            if (Config.RELEASE_GAME)
                trace(text);
            else
                alert(text);
        };
        GC.Cloud = {
            get isInGCCloud() {
                return window.location.href.includes('gamecreator');
            },
            get GameID() {
                if (!OpenAPI.GC.Cloud.isInGCCloud)
                    return 0;
                var releaseProject = window.location.href.split('releaseProject/').pop();
                if (!releaseProject)
                    return 0;
                var split = releaseProject.split('/');
                var shift = split.shift();
                if (!shift)
                    return 0;
                var p = shift.split('_');
                return Number.parseInt(p[1]);
            },
            get GameName() {
                if (!OpenAPI.GC.Cloud.isInGCCloud)
                    return '';
                var title = document.querySelector('title');
                if (!title)
                    return '';
                var name = title.innerText;
                var keywords = document.querySelector('meta[name="keywords"]');
                if (!keywords)
                    return '';
                var p = keywords.getAttribute('content');
                var remove = name + " | ";
                if (p && p.startsWith(remove)) {
                    p = p.replace(remove, '');
                    return p;
                }
                else {
                    return '';
                }
            },
            get GameVersion() {
                if (!OpenAPI.GC.Cloud.isInGCCloud)
                    return 0;
                var releaseProject = window.location.href.split('releaseProject/');
                var pop = releaseProject.pop();
                if (!pop)
                    return 0;
                var p = pop.split('/');
                return Number.parseInt(p[1]);
            },
            get AuthorUID() {
                if (!OpenAPI.GC.Cloud.isInGCCloud)
                    return 0;
                var releaseProject = window.location.href.split('releaseProject/');
                var pop = releaseProject.pop();
                if (!pop)
                    return 0;
                var split = pop.split('/');
                if (!split)
                    return 0;
                var shift = split.shift();
                if (!shift)
                    return 0;
                var p = shift.split('_');
                return Number.parseInt(p[0]);
            },
            get AuthorName() {
                if (!OpenAPI.GC.Cloud.isInGCCloud)
                    return '';
                var title = document.querySelector('title');
                if (!title)
                    return '';
                var p = title.innerText;
                return p;
            },
        };
        return GC;
    }());
    OpenAPI.GC = GC;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var InterfaceUtils = (function () {
        function InterfaceUtils() {
        }
        InterfaceUtils.NumberInput = function (ui, comp, value, min, max, subBtn, addBtn, minBtn, maxBtn) {
            if (!value) {
                value = 0;
            }
            var numValue = value;
            comp.text = numValue.toString();
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
            if (subBtn) {
                subBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputSubClick);
                subBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputSubClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }
            if (addBtn) {
                addBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputAddClick);
                addBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputAddClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }
            if (minBtn) {
                minBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMinClick);
                minBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMinClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }
            if (maxBtn) {
                maxBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMaxClick);
                maxBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMaxClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }
            comp.off(EventObject.INPUT, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.INPUT, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            comp.off(EventObject.BLUR, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.BLUR, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            comp.off(EventObject.CHANGE, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.CHANGE, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            comp.off(EventObject.FOCUS, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.FOCUS, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
        };
        InterfaceUtils.onNumberInputSubClick = function (comp, min, max, subBtn, addBtn, minBtn, maxBtn) {
            var numValue = Number(comp.text);
            numValue--;
            if (numValue < min) {
                numValue = min;
            }
            comp.text = numValue.toString();
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        };
        InterfaceUtils.onNumberInputAddClick = function (comp, min, max, subBtn, addBtn, minBtn, maxBtn) {
            var numValue = Number(comp.text);
            numValue++;
            if (numValue > max) {
                numValue = max;
            }
            comp.text = numValue.toString();
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        };
        InterfaceUtils.onNumberInputMinClick = function (comp, min, max, subBtn, addBtn, minBtn, maxBtn) {
            var numValue = min;
            comp.text = numValue.toString();
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        };
        InterfaceUtils.onNumberInputMaxClick = function (comp, min, max, subBtn, addBtn, minBtn, maxBtn) {
            var numValue = max;
            comp.text = numValue.toString();
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        };
        InterfaceUtils.onNumberInput = function (comp, min, max, subBtn, addBtn, minBtn, maxBtn) {
            var numValue = Number(comp.text);
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        };
        InterfaceUtils.onNumberInputCheck = function (value, comp, min, max, subBtn, addBtn, minBtn, maxBtn) {
            var numValue = value;
            if (numValue < min) {
                numValue = min;
            }
            if (numValue > max) {
                numValue = max;
            }
            comp.text = numValue.toString();
            if (subBtn) {
                subBtn.disabled = numValue <= min;
            }
            if (addBtn) {
                addBtn.disabled = numValue >= max;
            }
            if (minBtn) {
                minBtn.disabled = numValue <= min;
            }
            if (maxBtn) {
                maxBtn.disabled = numValue >= max;
            }
        };
        return InterfaceUtils;
    }());
    OpenAPI.InterfaceUtils = InterfaceUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var MathUtils = (function () {
        function MathUtils() {
        }
        MathUtils.clamp = function (value, bound1, bound2) {
            if (bound2 == null) {
                return Math.min(value, bound1);
            }
            return Math.min(Math.max(value, bound1), bound2);
        };
        MathUtils.inRange = function (value, minimum, maximum) {
            if (maximum == null) {
                maximum = minimum;
                minimum = 0;
            }
            if (minimum >= maximum) {
                throw new Error('The maximum value must be greater than the minimum value.');
            }
            return minimum <= value && value < maximum;
        };
        MathUtils.mean = function (nums) {
            return this.sum(nums) / nums.length;
        };
        MathUtils.meanBy = function (items, getValue) {
            var nums = items.map(function (x) { return getValue(x); });
            return this.mean(nums);
        };
        MathUtils.random = function (minimum, maximum) {
            if (maximum == null) {
                maximum = minimum;
                minimum = 0;
            }
            if (minimum >= maximum) {
                throw new Error('Invalid input: The maximum value must be greater than the minimum value.');
            }
            return Math.random() * (maximum - minimum) + minimum;
        };
        MathUtils.randomInt = function (minimum, maximum) {
            return Math.floor(this.random(minimum, maximum));
        };
        MathUtils.range = function (start, end, step) {
            if (end == null) {
                end = start;
                start = 0;
            }
            if (step == null) {
                step = 1;
            }
            if (!Number.isInteger(step) || step === 0) {
                throw new Error("The step value must be a non-zero integer.");
            }
            var length = Math.max(Math.ceil((end - start) / step), 0);
            var result = new Array(length);
            for (var i = 0; i < length; i++) {
                result[i] = start + i * step;
            }
            return result;
        };
        MathUtils.round = function (value, precision) {
            if (precision === void 0) { precision = 0; }
            if (!Number.isInteger(precision)) {
                throw new Error('Precision must be an integer.');
            }
            var multiplier = Math.pow(10, precision);
            return Math.round(value * multiplier) / multiplier;
        };
        MathUtils.sum = function (nums) {
            var result = 0;
            for (var _i = 0, nums_1 = nums; _i < nums_1.length; _i++) {
                var num = nums_1[_i];
                result += num;
            }
            return result;
        };
        return MathUtils;
    }());
    OpenAPI.MathUtils = MathUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var Method = (function () {
        function Method() {
        }
        Object.defineProperty(Method, "Origin", {
            get: function () {
                return window.location.protocol === 'http:' ? 'http://' : 'https://';
            },
            enumerable: false,
            configurable: true
        });
        Method.getRandomString = function (len, _charStr) {
            if (_charStr === void 0) { _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; }
            var min = 0;
            var max = _charStr.length - 1;
            var _str = '';
            if (len === 0)
                return '';
            for (var i = 0, index = void 0; i < len; i++) {
                index = (function (randomIndexFunc, i) {
                    return randomIndexFunc(min, max, i, randomIndexFunc);
                })(function (min, max, i, _self) {
                    var indexTemp = Math.floor(Math.random() * (max - min + 1) + min);
                    var numStart = _charStr.length - 10;
                    if (i === 0 && indexTemp >= numStart)
                        indexTemp = _self(min, max, i, _self);
                    return indexTemp;
                }, i);
                _str += _charStr[index];
            }
            return _str;
        };
        Method.dateToTimestamp = function (date) {
            return new Date(date.replace(/-/g, '/')).getTime();
        };
        Method.timestampToDate = function (data, data_type) {
            if (data_type === void 0) { data_type = ''; }
            var _data = 0;
            if (String(data).length === 13)
                _data = data;
            else
                _data = data * 1000;
            var time = new Date(_data);
            var _time;
            if (data_type === 'y')
                _time = time.getFullYear();
            if (data_type === 'm')
                _time = pad(time.getMonth() + 1, 2);
            if (data_type === 'd')
                _time = pad(time.getDate(), 2);
            if (data_type === 'h')
                _time = pad(time.getHours(), 2);
            if (data_type === 'i')
                _time = pad(time.getMinutes(), 2);
            if (data_type === 's')
                _time = pad(time.getSeconds(), 2);
            if (data_type === '')
                _time = time.getFullYear() + "/" + pad(time.getMonth() + 1, 2) + "/" + pad(time.getDate(), 2) + " " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2);
            function pad(num, size) {
                var s = "" + num;
                while (s.length < size)
                    s = "0" + s;
                return s;
            }
            return _time;
        };
        Method.JudgeTypeConstantVariable = function (constant, variable, index_type, variable_type) {
            if (variable_type === void 0) { variable_type = 0; }
            var variable_value;
            if (index_type === 0) {
                variable_value = constant;
            }
            else {
                if (variable_type === 0)
                    variable_value = Game.player.variable.getVariable(variable);
                if (variable_type === 1)
                    variable_value = Game.player.variable.getString(variable);
                if (variable_type === 2)
                    variable_value = Game.player.variable.getSwitch(variable);
            }
            return variable_value;
        };
        Method.cursorSystemStyleName_spliceName = function (name) {
            var cursorName = __spreadArray([], OpenAPI.Method.cursorSystemStyleName, true);
            return cursorName.filter(function (x) { return name.indexOf(x.toString()) === -1; });
        };
        Method.checkTemplateID = function (templateID) {
            return templateID.indexOf(Config.templateID) !== -1;
        };
        Method.getRandomColor = function () {
            return "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
        };
        Method.sendRequest = function (url, json, completeText, errorText, trigger, requestType) {
            if (trigger === void 0) { trigger = null; }
            if (requestType === void 0) { requestType = 'post'; }
            var ur = new HttpRequest();
            ur.send(url, JSON.stringify(json), requestType, 'json', ['Content-Type', 'application/json']);
            if (trigger) {
                trigger.pause = true;
                trigger.offset(1);
            }
            ur.once(EventObject.COMPLETE, this, function (content) {
                completeText(content);
                if (trigger)
                    CommandPage.executeEvent(trigger);
            });
            ur.once(EventObject.ERROR, this, function (content) {
                errorText(content);
                if (trigger)
                    CommandPage.executeEvent(trigger);
            });
        };
        Method.parseVarPlaceholderData = function (text, getData, regex) {
            if (getData === void 0) { getData = null; }
            if (regex === void 0) { regex = null; }
            if (getData == null) {
                getData = [
                    function (s) { return Game.player.variable.getVariable(s); },
                    function (s) { return Game.player.variable.getString(s); },
                    function (s) { return Game.player.variable.getSwitch(s); },
                    function (s) { return ClientWorld.variable.getVariable(s); },
                    function (s) { return ClientWorld.variable.getString(s); },
                    function (s) { return ClientWorld.variable.getSwitch(s); },
                    function (s) { return Game.player.variable.getVariable(Game.player.variable.getVariable(s)); },
                    function (s) { return Game.player.variable.getString(Game.player.variable.getVariable(s)); },
                    function (s) { return Game.player.variable.getSwitch(Game.player.variable.getVariable(s)); },
                    function (s) { return ClientWorld.variable.getVariable(ClientWorld.variable.getVariable(s)); },
                    function (s) { return ClientWorld.variable.getString(ClientWorld.variable.getVariable(s)); },
                    function (s) { return ClientWorld.variable.getSwitch(ClientWorld.variable.getVariable(s)); },
                ];
            }
            if (regex == null) {
                regex = [
                    /\[@v\w+\]/g,
                    /\[@s\w+\]/g,
                    /\[@b\w+\]/g,
                    /\[\$v\w+\]/g,
                    /\[\$s\w+\]/g,
                    /\[\$b\w+\]/g,
                    /\[@@v\w+\]/g,
                    /\[@@s\w+\]/g,
                    /\[@@b\w+\]/g,
                    /\[\$\$v\w+\]/g,
                    /\[\$\$s\w+\]/g,
                    /\[\$\$b\w+\]/g,
                ];
            }
            for (var i = 0; i < getData.length; i++) {
                var start = i >= 6 ? 4 : 3;
                var result = this.replacePlaceholderData(text, regex[i], getData[i], start);
                if (result)
                    text = result;
            }
            return text;
        };
        Method.parseGameVarPlaceholderData = function (text, gameData, regex) {
            if (regex === void 0) { regex = null; }
            var getData = [
                function (s) { return gameData[s] && gameData[s][0] ? CustomGameNumber["f" + gameData[s][0]](null, gameData[s][1]) : 0; },
                function (s) { return gameData[s] && gameData[s][0] ? CustomGameString["f" + gameData[s][0]](null, gameData[s][1]) : 0; },
                function (s) { return gameData[s] && gameData[s][0] ? CustomCondition["f" + gameData[s][0]](null, gameData[s][1]) : 0; },
            ];
            if (regex == null) {
                regex = [
                    /\[@gv\w+\]/g,
                    /\[@gs\w+\]/g,
                    /\[@gb\w+\]/g,
                ];
            }
            for (var i = 0; i < getData.length; i++) {
                var result = this.replacePlaceholderData(text, regex[i], getData[i], 4);
                if (result)
                    text = result;
            }
            return text;
        };
        Method.replacePlaceholderData = function (text, regex, getData, start, end) {
            if (start === void 0) { start = 3; }
            if (end === void 0) { end = ']'; }
            var matches = text.match(regex);
            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    var d = matches[i];
                    var s = Number(d.slice(start, d.indexOf(end)));
                    if (s || s == 0) {
                        var v = getData(s);
                        text = text.replace(d, v);
                    }
                }
                return text;
            }
            else {
                return null;
            }
        };
        ;
        Method.parseCombinedFunctions = function (text, regex) {
            if (regex === void 0) { regex = null; }
            var getData = [
                function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return Math.max.apply(Math, args);
                },
                function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return Math.min.apply(Math, args);
                },
                function (a, b) {
                    var _a = a < b ? [a, b] : [b, a], min = _a[0], max = _a[1];
                    return Math.random() * (max - min) + min;
                },
                function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return args.reduce(function (acc, val) { return acc + val; }, 0);
                },
                function (num) { return Math.abs(num); },
                function (num) { return Math.sqrt(num); },
                function (num) { return Math.round(num); },
            ];
            if (regex == null) {
                regex = [
                    /max\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
                    /min\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
                    /random\(-?\d+(\.\d+)?(,\s*)?-?\d+(\.\d+)?\)/g,
                    /reduce\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
                    /abs\(-?\d+(\.\d+)?\)/g,
                    /sqrt\((\d+(\.\d+)?)\)/g,
                    /round\(-?\d+(\.\d+)?\)/g,
                ];
            }
            for (var i = 0; i < getData.length; i++) {
                var result = this.replaceFunctionCombinations(text, regex[i], getData[i]);
                if (result)
                    text = result;
            }
            return text;
        };
        Method.replaceFunctionCombinations = function (text, regex, getData) {
            var matches = text.match(regex);
            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    var d = matches[i];
                    var argsString = d.slice(d.indexOf('(') + 1, d.indexOf(')'));
                    var args = argsString.split(',').map(Number);
                    if (args.every(function (arg) { return !isNaN(arg); })) {
                        var v = getData.apply(void 0, args);
                        text = text.replace(d, v.toString());
                    }
                }
                return text;
            }
            else {
                return null;
            }
        };
        Method.evaluateComplexExpression = function (expression, operators) {
            expression = expression.replace(/\s+/g, '');
            function parseExpression(expr, operators) {
                while (expr.includes('(')) {
                    expr = expr.replace(/\([^()]*\)/g, function (match) {
                        return String(parseExpression(match.slice(1, -1), operators));
                    });
                }
                var _loop_4 = function (regex, func) {
                    while (regex.test(expr)) {
                        expr = expr.replace(regex, function (match, p1, p2) {
                            var operand1 = isNaN(p1) ? (p1 === 'true' ? true : p1 === 'false' ? false : p1) : parseFloat(p1);
                            var operand2 = isNaN(p2) ? (p2 === 'true' ? true : p2 === 'false' ? false : p2) : parseFloat(p2);
                            return String(func(operand1, operand2));
                        });
                    }
                };
                for (var _i = 0, operators_1 = operators; _i < operators_1.length; _i++) {
                    var _a = operators_1[_i], regex = _a.regex, func = _a.func;
                    _loop_4(regex, func);
                }
                if (expr.startsWith('!')) {
                    var operand = expr.slice(1);
                    return !parseExpression(operand, operators);
                }
                var result = isNaN(expr) ? (expr === 'true' ? true : expr === 'false' ? false : expr) : parseFloat(expr);
                return result;
            }
            return parseExpression(expression, operators);
        };
        Method.intToRoman = function (num) {
            var val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
            var syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
            var roman = "";
            for (var i = 0; i < val.length; i++) {
                while (num >= val[i]) {
                    roman += syms[i];
                    num -= val[i];
                }
            }
            return roman;
        };
        Method.shuffleArray = function (array) {
            var _a;
            var shuffledArray = array.slice();
            for (var i = shuffledArray.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [shuffledArray[j], shuffledArray[i]], shuffledArray[i] = _a[0], shuffledArray[j] = _a[1];
            }
            return shuffledArray;
        };
        Method.getFeDataMessage = function (eventPage) {
            if (!eventPage)
                return null;
            var startIdx = eventPage.indexOf(String.fromCharCode(5));
            var feName = eventPage.slice(0, startIdx);
            return feName ? feName : null;
        };
        Method.getModuleData = function (id, comp, length) {
            if (length === void 0) { length = 16; }
            for (var i = 1; i <= length; i++) {
                for (var j = 1; j <= GameData.getLength(id, i); j++) {
                    var d = GameData.getModuleData(id, (i - 1) * 1000 + j);
                    if (d && d.name) {
                        comp.runWith([d]);
                    }
                }
            }
        };
        Method.getRange = function (start, end) {
            if (typeof start !== 'number' || typeof end !== 'number') {
                return null;
            }
            var range = [];
            if (start <= end) {
                for (var i = start; i <= end; i++) {
                    range.push(i);
                }
            }
            else {
                for (var i = start; i >= end; i--) {
                    range.push(i);
                }
            }
            return range;
        };
        Method.cursorSystemStyleName = [
            'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize',
        ];
        return Method;
    }());
    OpenAPI.Method = Method;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var ModuleUtils = (function () {
        function ModuleUtils() {
        }
        ModuleUtils.getModuleData = function (id, comp, length) {
            if (length === void 0) { length = 16; }
            return OpenAPI.Method.getModuleData(id, comp, length);
        };
        return ModuleUtils;
    }());
    OpenAPI.ModuleUtils = ModuleUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var ObjectUtils = (function () {
        function ObjectUtils() {
        }
        ObjectUtils.invert = function (obj) {
            var result = {};
            for (var key in obj) {
                var value = obj[key];
                result[value] = key;
            }
            return result;
        };
        ObjectUtils.omit = function (obj, keys) {
            var result = __assign({}, obj);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                delete result[key];
            }
            return result;
        };
        ObjectUtils.omitBy = function (obj, shouldOmit) {
            var result = {};
            for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (shouldOmit(value, key)) {
                    continue;
                }
                result[key] = value;
            }
            return result;
        };
        ObjectUtils.pick = function (obj, keys) {
            var result = {};
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                result[key] = obj[key];
            }
            return result;
        };
        ObjectUtils.pickBy = function (obj, shouldPick) {
            var result = {};
            for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (!shouldPick(value, key)) {
                    continue;
                }
                result[key] = value;
            }
            return result;
        };
        return ObjectUtils;
    }());
    OpenAPI.ObjectUtils = ObjectUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var OsUtils = (function () {
        function OsUtils() {
        }
        Object.defineProperty(OsUtils, "systemUserName", {
            get: function () {
                var userInfo = OpenAPI.RunUtils.os.userInfo();
                if (userInfo == null) {
                    return "";
                }
                if (userInfo.username == null) {
                    return "";
                }
                try {
                    var fullName = "";
                    var buffer = OpenAPI.RunUtils.child_process.execSync("wmic useraccount where name=\"" + userInfo.username + "\" get fullname", { encoding: 'buffer' });
                    var langInfo = window.navigator.language;
                    var decoder = void 0;
                    if (langInfo == "zh-CN") {
                        decoder = new TextDecoder('gbk');
                    }
                    else {
                        decoder = new TextDecoder();
                    }
                    var info = decoder.decode(buffer);
                    var fullNameInfo = info.split("\n")[1];
                    fullName = fullNameInfo.trim();
                    if (fullName == "") {
                        fullName = userInfo.username;
                    }
                    return fullName;
                }
                catch (e) {
                    console.error(e);
                    return userInfo.username;
                }
            },
            enumerable: false,
            configurable: true
        });
        return OsUtils;
    }());
    OpenAPI.OsUtils = OsUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var PathUtils = (function () {
        function PathUtils() {
        }
        Object.defineProperty(PathUtils, "gamePath", {
            get: function () {
                var path = '';
                if (!Config.RELEASE_GAME) {
                    var random = OpenAPI.MathUtils.randomInt(1000, 100000);
                    var tempIdentifier = "OpenAPITempGamePathIdentifier" + random;
                    path = decodeURIComponent(Laya.URL.formatURL(tempIdentifier)).replace("/" + tempIdentifier, '');
                }
                else {
                    path = FileUtils.nativePath;
                }
                return path;
            },
            enumerable: false,
            configurable: true
        });
        return PathUtils;
    }());
    OpenAPI.PathUtils = PathUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var Point = (function () {
        function Point() {
        }
        Point.toCoordinateObjects = function (arr) {
            var result = [];
            for (var i = 0; i < arr.length; i += 2)
                result.push({ x: arr[i], y: arr[i + 1] });
            return result;
        };
        Point.relativeToParent = function (objectsArray, parent) {
            return objectsArray.map(function (point) { return ({
                x: point.x + parent.x,
                y: point.y + parent.y,
            }); });
        };
        return Point;
    }());
    OpenAPI.Point = Point;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var PredicateUtils = (function () {
        function PredicateUtils() {
        }
        PredicateUtils.isNil = function (x) {
            return x === null || x === undefined;
        };
        PredicateUtils.isNotNil = function (x) {
            return x !== null && x !== undefined;
        };
        PredicateUtils.isNull = function (x) {
            return x === null;
        };
        PredicateUtils.isUndefined = function (x) {
            return x === undefined;
        };
        return PredicateUtils;
    }());
    OpenAPI.PredicateUtils = PredicateUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var PromiseUtils = (function () {
        function PromiseUtils() {
        }
        PromiseUtils.delay = function (ms, _a) {
            var _b = _a === void 0 ? {} : _a, signal = _b.signal;
            return new Promise(function (resolve, reject) {
                var abortError = function () {
                    reject(new OpenAPI.AbortError());
                };
                var abortHandler = function () {
                    clearTimeout(timeoutId);
                    abortError();
                };
                if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                    return abortError();
                }
                var timeoutId = setTimeout(resolve, ms);
                signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', abortHandler, { once: true });
            });
        };
        return PromiseUtils;
    }());
    OpenAPI.PromiseUtils = PromiseUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var Require = (function () {
        function Require() {
        }
        Require.Init = function (name, filename) {
            filename = filename ? name + "/" + filename : name + "/" + name;
            var path = os.inGC() ? decodeURIComponent(Laya.URL.formatURL('asset')) + "/myally_modules/" + filename : FileUtils.nativePath + "/asset/myally_modules/" + filename;
            var topRequire = typeof require != 'undefined' ? require : top.top.require;
            return topRequire(path);
        };
        return Require;
    }());
    OpenAPI.Require = Require;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var RunUtils = (function () {
        function RunUtils() {
        }
        RunUtils.require = function (name) {
            return mainDomain_require(name);
        };
        Object.defineProperty(RunUtils, "fs", {
            get: function () {
                return OpenAPI.RunUtils.require('fs');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RunUtils, "path", {
            get: function () {
                return OpenAPI.RunUtils.require('path');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RunUtils, "os", {
            get: function () {
                return OpenAPI.RunUtils.require('os');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RunUtils, "process", {
            get: function () {
                return OpenAPI.RunUtils.require('process');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RunUtils, "child_process", {
            get: function () {
                return OpenAPI.RunUtils.require('child_process');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RunUtils, "nw_gui", {
            get: function () {
                return OpenAPI.RunUtils.require('nw.gui');
            },
            enumerable: false,
            configurable: true
        });
        return RunUtils;
    }());
    OpenAPI.RunUtils = RunUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var StringUtils = (function () {
        function StringUtils() {
        }
        Object.defineProperty(StringUtils, "randomColor", {
            get: function () {
                return OpenAPI.Method.getRandomColor();
            },
            enumerable: false,
            configurable: true
        });
        StringUtils.snakeCase = function (str) {
            var splitWords = str.match(OpenAPI.ConstantsUtils.CASE_SPLIT_PATTERN) || [];
            return splitWords.map(function (word) { return word.toLowerCase(); }).join('_');
        };
        StringUtils.randomString = function (length, str) {
            if (str === void 0) { str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; }
            return OpenAPI.Method.getRandomString(length, str);
        };
        StringUtils.parseVariableText = function (text, getData, regex) {
            if (getData === void 0) { getData = null; }
            if (regex === void 0) { regex = null; }
            return OpenAPI.Method.parseVarPlaceholderData(text, getData, regex);
        };
        StringUtils.parseGameVariableText = function (text, gameData, regex) {
            if (regex === void 0) { regex = null; }
            return OpenAPI.Method.parseGameVarPlaceholderData(text, gameData, regex);
        };
        StringUtils.parseFunctionText = function (text, regex) {
            if (regex === void 0) { regex = null; }
            return OpenAPI.Method.parseCombinedFunctions(text, regex);
        };
        StringUtils.arabicToRoman = function (num) {
            return OpenAPI.Method.intToRoman(num);
        };
        return StringUtils;
    }());
    OpenAPI.StringUtils = StringUtils;
})(OpenAPI || (OpenAPI = {}));
(function (OpenAPI) {
    var System = (function () {
        function System() {
        }
        System.Version = 3.6;
        System.Installed = true;
        return System;
    }());
    OpenAPI.System = System;
    setTimeout(function () {
        if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
            if (!Config.RELEASE_GAME)
                trace("OpenAPI v" + OpenAPI.System.Version.toFixed(1) + " => OK");
            else
                console.log(" %c OpenAPI v" + OpenAPI.System.Version.toFixed(1) + " %c https://www.gamecreator.com.cn/plug/det/641 ", 'color: #fadfa3; background: #333; padding:8px;border-left:1px solid #fadfa3;border-top:1px solid #fadfa3;border-bottom:1px solid #fadfa3;', 'color: #fadfa3; background: #333; padding:8px; border:1px solid #fadfa3;');
        }
    }, 1000);
})(OpenAPI || (OpenAPI = {}));
;
(function (OpenAPI) {
    var UI = (function () {
        function UI() {
        }
        UI.listDataInit = function (list, List_modelGUI, list_len, isFocus) {
            if (isFocus === void 0) { isFocus = false; }
            var arr = [];
            for (var i = 1; i <= list_len; i++)
                arr.push(new List_modelGUI());
            list.items = arr;
            if (isFocus)
                UIList.focus = list;
        };
        return UI;
    }());
    OpenAPI.UI = UI;
    var ShowTips = (function () {
        function ShowTips() {
        }
        ShowTips.showTips = function (tipData, id) {
            this.tipUIId = id;
            if (!this.tipUI || this.tipUI.id !== String(id)) {
                this.tipUI = GameUI.show(id);
                this.tipUI.x = stage.mouseX + 15;
                this.tipUI.y = stage.mouseY + 15;
                var maxWidth = Config.WINDOW_WIDTH - 5;
                var maxHeight = Config.WINDOW_HEIGHT - 15;
                if (this.tipUI.tipRoot) {
                    if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
                        this.tipUI.x = maxWidth - this.tipUI.tipRoot.width;
                    if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
                        this.tipUI.y = maxHeight - this.tipUI.tipRoot.height;
                }
                this.tipUI.mouseEnabled = false;
                for (var data in tipData) {
                    if (this.tipUI[data] && tipData[data]) {
                        for (var d in tipData[data])
                            this.tipUI[data][d] = tipData[data][d];
                    }
                }
            }
            else {
                this.tipUI.x = stage.mouseX + 15;
                this.tipUI.y = stage.mouseY + 15;
                var maxWidth = Config.WINDOW_WIDTH - 5;
                var maxHeight = Config.WINDOW_HEIGHT - 15;
                if (this.tipUI.tipRoot) {
                    if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
                        this.tipUI.x = maxWidth - this.tipUI.tipRoot.width;
                    if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
                        this.tipUI.y = maxHeight - this.tipUI.tipRoot.height;
                }
            }
        };
        ShowTips.colseTip = function () {
            if (this.tipUIId)
                GameUI.hide(this.tipUIId);
            this.tipUIId = 0;
        };
        ShowTips.init = function (id) {
            if (this.isInit)
                return;
            this.isInit = true;
            GameUI.load(id);
            stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.colseTip);
        };
        ShowTips.addTipEvent = function (ui, tipId, tipData, delayed, expandList) {
            var _this = this;
            if (delayed === void 0) { delayed = 0; }
            if (expandList === void 0) { expandList = false; }
            this.init(tipId);
            var onItemCreate = function (_ui, data, index) {
                _this.addTipEvent(_ui, tipId, data['tip'], delayed, false);
            };
            var addTip = function () {
                ui.off(EventObject.MOUSE_MOVE, _this, _this.showTip);
                ui.off(EventObject.MOUSE_OUT, _this, _this.colseTip);
                ui.off(EventObject.MOUSE_MOVE, _this, _this.moveTip);
                _this.showTip = function () {
                    if (_this.tipUIId) {
                        GameUI.hide(_this.tipUIId);
                        _this.tipUIId = 0;
                    }
                    _this.onTipId = tipId;
                    setTimeout(function () {
                        if (_this.onTipId === tipId)
                            _this.showTips(tipData, tipId);
                    }, delayed);
                };
                _this.moveTip = function () {
                    if (_this.tipUIId === tipId)
                        _this.showTips(tipData, tipId);
                };
                ui.on(EventObject.MOUSE_OVER, _this, _this.showTip);
                ui.on(EventObject.MOUSE_MOVE, _this, _this.moveTip);
                ui.on(EventObject.MOUSE_OUT, _this, _this.colseTip);
            };
            if (ui instanceof UIList && expandList)
                ui.on(UIList.ITEM_CREATE, this, onItemCreate);
            else
                addTip();
        };
        ShowTips.isInit = false;
        return ShowTips;
    }());
    OpenAPI.ShowTips = ShowTips;
})(OpenAPI || (OpenAPI = {}));
//# sourceMappingURL=OpenAPI.js.map
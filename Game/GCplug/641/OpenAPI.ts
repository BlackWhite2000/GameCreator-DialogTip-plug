module OpenAPI {
    /**
     * 动画操作工具
     */
    export class AnimationUtils {

        /**
         * 设置对象数据
         * @param object_1 来源
         * @param object_2 目标
         */
        private static setObjectData(object_1: GameSprite, object_2: GameSprite) {
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
        }

        /**
         * 设置动画
         * @param object 目标对象
         * @param aniID 动画编号
         * @param complete 回调
         */
        static setAnimation(object: GameSprite, aniID: number, complete?: Callback) {
            const ui = new UIRoot()
            const ani = new GCAnimation()
            this.setObjectData(object, ui)
            object.parent.addChild(ui)
            ui.addChild(object)
            ani.id = aniID
            ani.target = object
            ani.play()
            ani.once(GCAnimation.PLAY_COMPLETED, this, (ani: GCAnimation, object: GameSprite, ui: UIRoot) => {
                ani.dispose()
                ui.parent.addChild(object)
                this.setObjectData(ui, object)
                ui.dispose()
                if (complete) {
                    complete.run()
                }
            }, [ani, object, ui]);
        }

        /**
         * 设置图像动画
         * @param taskName 任务名称, 如果为空则不使用SyncTask
         * @param object 图像
         * @param aniID 动画编号
         * @param complete 回调
         */
        static setImageAnimation(taskName: string | null, object: UIStandAvatar, aniID: number, complete?: Callback) {
            if (!object) return
            if (taskName) {
                new SyncTask(taskName, () => {
                    this.setAnimation(object, aniID, Callback.New(() => {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run()
                        }
                    }, this))
                })
            } else {
                this.setAnimation(object, aniID, Callback.New(() => {
                    if (complete) {
                        complete.run()
                    }
                }, this))
            }
        }

        /**
         * 设置界面动画
         * @param taskName 任务名称, 如果为空则不使用SyncTask
         * @param object 界面
         * @param aniID 动画编号
         * @param complete 回调
         */
        static setUIAnimation(taskName: string | null, object: GUI_BASE, aniID: number, complete?: Callback) {
            if (!object) return
            if (taskName) {
                new SyncTask(taskName, () => {
                    this.setAnimation(object, aniID, Callback.New(() => {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run()
                        }
                    }, this))
                })
            } else {
                this.setAnimation(object, aniID, Callback.New(() => {
                    if (complete) {
                        complete.run()
                    }
                }, this))
            }
        }

        /**
          * 设置场景对象动画
          * @param taskName 任务名称, 如果为空则不使用SyncTask
          * @param object 场景对象
          * @param aniID 动画编号
          * @param loop 是否循环播放
          * @param isHit 是否显示被击中的效果，动画编辑器支持动画层仅命中时显示，如果设置为true即表示该动画所有层均显示
         * @param complete 回调
          */
        static setSceneObjectAnimation(taskName: string | null, object: ProjectClientSceneObject, aniID: number, loop: boolean = false, isHit: boolean = false, complete?: Callback) {
            if (!object) return
            if (taskName) {
                new SyncTask(taskName, () => {
                    const soAni = object.playAnimation(aniID, loop, isHit)
                    soAni.once(GCAnimation.PLAY_COMPLETED, this, () => {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run()
                        }
                    })
                })
            } else {
                const soAni = object.playAnimation(aniID, loop, isHit)
                soAni.once(GCAnimation.PLAY_COMPLETED, this, () => {
                    if (complete) {
                        complete.run()
                    }
                })
            }
        }
    }
}
module OpenAPI {
    type NotFalsey<T> = Exclude<T, false | null | 0 | '' | undefined>;
    type Order = 'asc' | 'desc';
    type Unzip<K extends unknown[]> = { [I in keyof K]: Array<K[I]> };

    /**
     * 数组操作工具
     */
    export class ArrayUtils {

        /**
        * 将数组拆分成指定长度的小数组。
        *
        * 此函数接收一个输入数组并将其划分为多个小数组，每个小数组的长度由指定的大小决定。
        * 如果输入数组不能被均匀分割，最后一个小数组将包含剩余的元素。
        *
        * @template T 数组中元素的类型。
        * @param {T[]} arr - 要拆分的小数组的数组。
        * @param {number} size - 每个小数组的大小。必须是正整数。
        * @returns {T[][]} 一个二维数组，其中每个子数组的最大长度为 `size`。
        * @throws {Error} 如果 `size` 不是正整数，则抛出错误。
        *
        * @example
        * // 将一个数字数组拆分成长度为 2 的子数组
        * chunk([1, 2, 3, 4, 5], 2);
        * // 返回: [[1, 2], [3, 4], [5]]
        *
        * @example
        * // 将一个字符串数组拆分成长度为 3 的子数组
        * chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3);
        * // 返回: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]
        */
        static chunk<T>(arr: readonly T[], size: number): T[][] {
            if (!Number.isInteger(size) || size <= 0) {
                throw new Error('Size must be an integer greater than zero.');
            }

            const chunkLength = Math.ceil(arr.length / size);
            const result: T[][] = Array(chunkLength);

            for (let index = 0; index < chunkLength; index++) {
                const start = index * size;
                const end = start + size;

                result[index] = arr.slice(start, end);
            }

            return result;
        }

        /**
         * 从数组中移除假值 (false, null, 0, '', undefined, NaN)。
         *
         * @template T - 数组中元素的类型。
         * @param {readonly T[]} arr - 要移除假值的输入数组。
         * @returns {Array<Exclude<T, false | null | 0 | '' | undefined>>} - 一个新数组，其中所有假值都被移除。
         *
         * @example
         * compact([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
         * // 返回: [1, 2, 3, 4, 5]
         */
        static compact<T>(arr: readonly T[]): Array<NotFalsey<T>> {
            const result: Array<NotFalsey<T>> = [];

            for (const item of arr) {
                if (item) {
                    result.push(item as NotFalsey<T>);
                }
            }

            return result;
        }

        /**
         * 根据转换函数计算数组中每个项的出现次数。
         *
         * 此函数接收一个数组和一个转换函数，将数组中的每个项转换为字符串键，
         * 然后统计每个转换后项的出现次数，并返回一个包含转换后项作为键和计数作为值的对象。
         *
         * @template T - 输入数组中项的类型。
         *
         * @param {T[]} arr - 要计算出现次数的输入数组。
         * @param {(item: T) => string} mapper - 将每个项映射到字符串键的转换函数。
         * @returns {Record<string, number>} 包含转换后项作为键和计数作为值的对象。
         *
         * @example
         * const array = [1, 2, 2, 3, 3, 3];
         * const counts = countBy(array, String);
         * // 返回: { '1': 1, '2': 2, '3': 3 }
         */
        static countBy<T>(arr: T[], mapper: (item: T) => string): Record<string, number> {
            const result: Record<string, number> = {};

            for (const item of arr) {
                const key = mapper(item);

                result[key] = (result[key] ?? 0) + 1;
            }

            return result;
        }

        /**
         * 计算两个数组之间的差异。
         *
         * 此函数接收两个数组并返回一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素。
         * 它有效地过滤掉第一个数组中在第二个数组中也出现的任何元素。
         *
         * @template T
         * @param {T[]} firstArr - 要计算差异的数组。这是主要数组，将从中比较和过滤元素。
         * @param {T[]} secondArr - 包含要从第一个数组中排除的元素的数组。
         * 每个数组中的元素将与第一个数组进行比较，如果找到匹配，则该元素将从结果中排除。
         * @returns {T[]} 一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素。
         *
         * @example
         * const array1 = [1, 2, 3, 4, 5];
         * const array2 = [2, 4];
         * const result = difference(array1, array2);
         * // result 将是 [1, 3, 5]，因为2和4在两个数组中都存在，所以被排除在结果之外。
         */
        static difference<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
            const secondSet = new Set(secondArr);

            return firstArr.filter(item => !secondSet.has(item));
        }

        /**
         * 根据提供的映射函数计算两个数组之间的差异。
         *
         * 此函数接收两个数组和一个映射函数。它返回一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素，
         * 这是基于映射函数计算的身份来决定的。
         *
         * 实质上，它过滤掉第一个数组中在第二个数组经过映射后有对应的元素。
         *
         * @template T, U
         * @param {T[]} firstArr - 主要数组，用于计算差异。
         * @param {T[]} secondArr - 包含要从第一个数组中排除的元素的数组。
         * @param {(value: T) => U} mapper - 用于映射两个数组元素的函数。该函数应用于每个数组中的每个元素，
         * 并基于映射后的值进行比较。
         * @returns {T[]} 一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中对应映射身份的元素。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const mapper = item => item.id;
         * const result = differenceBy(array1, array2, mapper);
         * // result 将是 [{ id: 1 }, { id: 3 }]，因为具有 id 为 2 的元素在两个数组中都存在，因此被排除在结果之外。
         */
        static differenceBy<T, U>(firstArr: readonly T[], secondArr: readonly T[], mapper: (value: T) => U): T[] {
            const mappedSecondSet = new Set(secondArr.map(item => mapper(item)));

            return firstArr.filter(item => {
                return !mappedSecondSet.has(mapper(item));
            });
        }

        /**
         * 根据自定义相等性函数计算两个数组之间的差异。
         *
         * 此函数接收两个数组和一个自定义比较函数。它返回一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素。
         * 判断元素是否相等是使用提供的自定义函数进行比较的。
         *
         * @template T
         * @param {T[]} firstArr - 要计算差异的数组。
         * @param {T[]} secondArr - 包含要从第一个数组中排除的元素的数组。
         * @param {(x: T, y: T) => boolean} areItemsEqual - 用于判断两个项是否相等的函数。
         * @returns {T[]} 一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素，
         * 根据提供的自定义相等性函数判断。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const areItemsEqual = (a, b) => a.id === b.id;
         * const result = differenceWith(array1, array2, areItemsEqual);
         * // result 将是 [{ id: 1 }, { id: 3 }]，因为具有 id 为 2 的元素被视为相等，因此被排除在结果之外。
         */
        static differenceWith<T>(
            firstArr: readonly T[],
            secondArr: readonly T[],
            areItemsEqual: (x: T, y: T) => boolean
        ): T[] {
            return firstArr.filter(firstItem => {
                return secondArr.every(secondItem => {
                    return !areItemsEqual(firstItem, secondItem);
                });
            });
        }

        /**
         * 从数组的开头移除指定数量的元素并返回剩余部分。
         *
         * 此函数接收一个数组和一个数字，并返回一个新数组，其中从开头移除了指定数量的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要从中移除元素的数组。
         * @param {number} itemsCount - 要从数组开头移除的元素数量。
         * @returns {T[]} 一个新数组，其中从开头移除了指定数量的元素。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = drop(array, 2);
         * // result 将是 [3, 4, 5]，因为前两个元素被移除了。
         */
        static drop<T>(arr: readonly T[], itemsCount: number): T[] {
            return arr.slice(itemsCount);
        }

        /**
         * 从数组末尾移除指定数量的元素并返回剩余部分。
         *
         * 此函数接受一个数组和一个数字，并返回一个新的数组，
         * 该数组的末尾移除了指定数量的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要删除元素的数组。
         * @param {number} itemsCount - 要从数组末尾删除的元素数量。
         * @returns {T[]} 一个从末尾移除指定数量元素的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = dropRight(array, 2);
         * // 结果将是 [1, 2, 3] 因为最后两个元素被删除。
         */
        static dropRight<T>(arr: readonly T[], itemsCount: number): T[] {
            return arr.slice(0, -itemsCount);
        }

        /**
         * 从数组末尾移除元素直到谓词返回false。
         *
         * 此函数从数组末尾开始遍历并删除元素，直到提供的谓词函数返回false。
         * 然后返回一个包含剩余元素的新数组。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要删除元素的数组。
         * @param {(item: T) => boolean} canContinueDropping - 一个决定是否继续删除元素的谓词函数。
         * 该函数从末尾开始接收每个元素并在返回true时继续删除元素。
         * @returns {T[]} 一个在谓词返回false后剩余元素的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = dropRightWhile(array, x => x > 3);
         * // 结果将是 [1, 2, 3] 因为大于3的元素从末尾被删除。
         */
        static dropRightWhile<T>(arr: readonly T[], canContinueDropping: (item: T) => boolean): T[] {
            const reversed = arr.slice().reverse();
            const dropped = this.dropWhile(reversed, canContinueDropping);
            return dropped.slice().reverse();
        }

        /**
         * 从数组开头移除元素直到谓词返回false。
         *
         * 此函数遍历数组并从开始位置删除元素，直到提供的谓词函数返回false。
         * 然后返回一个包含剩余元素的新数组。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要删除元素的数组。
         * @param {(item: T) => boolean} canContinueDropping - 一个决定是否继续删除元素的谓词函数。
         * 该函数接收每个元素并在返回true时继续删除元素。
         * @returns {T[]} 一个在谓词返回false后剩余元素的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = dropWhile(array, x => x < 3);
         * // 结果将是 [3, 4, 5] 因为小于3的元素被删除。
         */
        static dropWhile<T>(arr: readonly T[], canContinueDropping: (item: T) => boolean): T[] {
            const dropEndIndex = arr.findIndex(item => !canContinueDropping(item));
            if (dropEndIndex === -1) {
                return [];
            }

            return arr.slice(dropEndIndex);
        }

        /**
         * 填充数组的指定位置范围内的元素为指定值，但不包括结束位置。
         *
         * 此函数会改变原始数组，并用提供的值替换从指定的起始索引到结束索引（不包括结束索引）的元素。
         * 如果未提供起始或结束索引，则默认填充整个数组。可以使用负索引来指定从数组末尾开始的位置。
         *
         * @param {Array<T | P>} arr - 要填充的数组。
         * @param {P} value - 要填充数组的值。
         * @param {number} [start=0] - 起始位置，默认为 0。
         * @param {number} [end=arr.length] - 结束位置，默认为数组的长度。
         * @returns {Array<T | P>} 填充后的数组。
         *
         * @example
         * const array = [1, 2, 3];
         * const result = fill(array, 'a');
         * // => ['a', 'a', 'a']
         *
         * const result = fill(Array(3), 2);
         * // => [2, 2, 2]
         *
         * const result = fill([4, 6, 8, 10], '*', 1, 3);
         * // => [4, '*', '*', 10]
         */
        static fill<T>(arr: unknown[], value: T): T[];
        static fill<T, P>(arr: Array<T | P>, value: P, start: number): Array<T | P>;
        static fill<T, P>(arr: Array<T | P>, value: P, start: number, end: number): Array<T | P>;
        static fill<T, P>(arr: Array<T | P>, value: P, start = 0, end = arr.length): Array<T | P> {
            start = Math.max(start, 0);
            end = Math.min(end, arr.length);

            for (let i = start; i < end; i++) {
                arr[i] = value;
            }

            return arr;
        }

        /**
         * 将数组展开至指定深度。
         *
         * @template T - 数组中元素的类型。
         * @template D - 指定数组展开的深度。
         * @param {T[]} arr - 要展开的数组。
         * @param {D} depth - 指定的展开深度级别，表示嵌套数组结构应展开多深。默认为 1。
         * @returns {Array<FlatArray<T[], D>>} 展开后的新数组。
         *
         * @example
         * const arr = flatten([1, [2, 3], [4, [5, 6]]], 1);
         * // 返回: [1, 2, 3, 4, [5, 6]]
         *
         * const arr = flatten([1, [2, 3], [4, [5, 6]]], 2);
         * // 返回: [1, 2, 3, 4, 5, 6]
         */
        static flatten<T, D extends number = 1>(arr: readonly T[], depth: D = 1 as D): Array<FlatArray<T[], D>> {
            const result: Array<FlatArray<T[], D>> = [];
            const flooredDepth = Math.floor(depth);

            const recursive = (arr: readonly T[], currentDepth: number) => {
                for (const item of arr) {
                    if (Array.isArray(item) && currentDepth < flooredDepth) {
                        recursive(item, currentDepth + 1);
                    } else {
                        result.push(item as FlatArray<T[], D>);
                    }
                }
            };

            recursive(arr, 0);
            return result;
        }

        /**
         * 从右到左遍历 'arr' 的元素，并为每个元素调用 'callback'。
         * 
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要遍历的数组。
         * @param {(value: T, index: number, arr: T[]) => void} callback - 每次迭代调用的函数。
         * callback 函数接收三个参数：
         *  - 'value': 数组中当前处理的元素。
         *  - 'index': 数组中当前处理的元素的索引。
         *  - 'arr': 调用 'forEachRight' 的数组。
         * 
         * @example
         * const array = [1, 2, 3];
         * const result: number[] = [];
         * 
         * // 使用 forEachRight 函数遍历数组并将每个元素添加到 result 数组中。
         * forEachRight(array, (value) => {
         *  result.push(value);
         * })
         * 
         * console.log(result) // 输出: [3, 2, 1]
         */
        static forEachRight<T>(arr: T[], callback: (value: T, index: number, arr: T[]) => void): void {
            for (let i = arr.length - 1; i >= 0; i--) {
                const element = arr[i];
                callback(element, i, arr);
            }
        }

        /**
         * 根据提供的键生成函数，对数组元素进行分组。
         *
         * 该函数接受一个数组和一个从每个元素生成键的函数。它返回一个对象，其中键是生成的键，值是具有相同键的元素数组。
         *
         * @template T - 数组中元素的类型。
         * @template K - 键的类型。
         * @param {T[]} arr - 要分组的数组。
         * @param {(item: T) => K} getKeyFromItem - 从元素生成键的函数。
         * @returns {Record<K, T[]>} 一个对象，其中每个键关联一个具有相同键的元素数组。
         *
         * @example
         * const array = [
         *   { category: 'fruit', name: 'apple' },
         *   { category: 'fruit', name: 'banana' },
         *   { category: 'vegetable', name: 'carrot' }
         * ];
         * const result = groupBy(array, item => item.category);
         * // result 将会是:
         * // {
         * //   fruit: [
         * //     { category: 'fruit', name: 'apple' },
         * //     { category: 'fruit', name: 'banana' }
         * //   ],
         * //   vegetable: [
         * //     { category: 'vegetable', name: 'carrot' }
         * //   ]
         * // }
         */
        static groupBy<T, K extends PropertyKey>(arr: readonly T[], getKeyFromItem: (item: T) => K): Record<K, T[]> {
            const result = {} as Record<K, T[]>;

            for (const item of arr) {
                const key = getKeyFromItem(item);

                if (result[key] == null) {
                    result[key] = [];
                }

                result[key].push(item);
            }

            return result;
        }

        /**
         * 返回数组的第一个元素。
         *
         * 该函数接受一个数组并返回数组的第一个元素。
         * 如果数组为空，则返回 `undefined`。
         *
         * @param {T[]} arr - 要获取第一个元素的数组。
         * @returns {T | undefined} 数组的第一个元素，如果数组为空则返回 `undefined`。
         *
         * @example
         * const arr = [1, 2, 3];
         * const firstElement = head(arr);
         * // firstElement 将会是 1
         *
         * const emptyArr: number[] = [];
         * const noElement = head(emptyArr);
         * // noElement 将会是 undefined
         */
        static head<T>(arr: readonly [T, ...T[]]): T;
        static head<T>(arr: readonly T[]): T | undefined;
        static head<T>(arr: readonly T[]): T | undefined {
            return arr[0];
        }

        /**
         * 返回两个数组的交集。
         *
         * 该函数接受两个数组并返回一个新数组，其中包含同时存在于两个数组中的元素。
         * 它有效地过滤掉第一个数组中在第二个数组中找不到的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} firstArr - 要比较的第一个数组。
         * @param {T[]} secondArr - 要比较的第二个数组。
         * @returns {T[]} 一个新数组，包含同时存在于两个数组中的元素。
         *
         * @example
         * const array1 = [1, 2, 3, 4, 5];
         * const array2 = [3, 4, 5, 6, 7];
         * const result = intersection(array1, array2);
         * // result 将会是 [3, 4, 5]，因为这些元素同时存在于两个数组中。
         */
        static intersection<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
            const secondSet = new Set(secondArr);

            return firstArr.filter(item => {
                return secondSet.has(item);
            });
        }

        /**
         * 根据映射函数返回两个数组的交集。
         *
         * 该函数接受两个数组和一个映射函数。它返回一个新数组，其中包含来自第一个数组的元素，
         * 当使用提供的映射函数映射时，在第二个数组中具有匹配的映射元素。它有效地过滤掉第一个数组中
         * 没有对应映射值的元素。
         *
         * @template T - 数组中元素的类型。
         * @template U - 映射后的元素类型。
         * @param {T[]} firstArr - 要比较的第一个数组。
         * @param {T[]} secondArr - 要比较的第二个数组。
         * @param {(item: T) => U} mapper - 用于映射两个数组元素进行比较的函数。
         * @returns {T[]} 一个新数组，包含来自第一个数组的元素，在第二个数组中具有对应映射值的元素。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const mapper = item => item.id;
         * const result = intersectionBy(array1, array2, mapper);
         * // result 将会是 [{ id: 2 }]，因为只有这个元素在两个数组中具有匹配的 id。
         */
        static intersectionBy<T, U>(firstArr: readonly T[], secondArr: readonly T[], mapper: (item: T) => U): T[] {
            const mappedSecondSet = new Set(secondArr.map(mapper));
            return firstArr.filter(item => mappedSecondSet.has(mapper(item)));
        }

        /**
         * 根据自定义相等函数返回两个数组的交集。
         *
         * 该函数接受两个数组和一个自定义相等函数。它返回一个新数组，其中包含来自第一个数组的元素，
         * 这些元素在第二个数组中有匹配的元素，由自定义相等函数确定。它有效地过滤掉第一个数组中没有
         * 对应匹配的第二个数组元素的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} firstArr - 要比较的第一个数组。
         * @param {T[]} secondArr - 要比较的第二个数组。
         * @param {(x: T, y: T) => boolean} areItemsEqual - 一个自定义函数，用于确定两个元素是否相等。
         * 此函数接受两个参数，分别来自每个数组，如果元素被认为相等，则返回 `true`，否则返回 `false`。
         * @returns {T[]} 一个新数组，包含来自第一个数组的元素，这些元素在第二个数组中有相应匹配的元素，根据自定义相等函数确定。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const areItemsEqual = (a, b) => a.id === b.id;
         * const result = intersectionWith(array1, array2, areItemsEqual);
         * // result 将会是 [{ id: 2 }]，因为这个元素在两个数组中具有匹配的 id。
         */
        static intersectionWith<T>(
            firstArr: readonly T[],
            secondArr: readonly T[],
            areItemsEqual: (x: T, y: T) => boolean
        ): T[] {
            return firstArr.filter(firstItem => {
                return secondArr.some(secondItem => {
                    return areItemsEqual(firstItem, secondItem);
                });
            });
        }

        /**
         * 根据提供的键生成函数，将数组中的每个元素映射为一个对象。
         *
         * 该函数接受一个数组和一个生成键的函数。它返回一个对象，其中键是根据生成函数生成的键，而值是相应的元素。
         * 如果有多个元素生成相同的键，则使用它们中的最后一个元素作为值。
         *
         * @template T - 数组中元素的类型。
         * @template K - 键的类型。
         * @param {T[]} arr - 要映射的元素数组。
         * @param {(item: T) => K} getKeyFromItem - 从元素生成键的函数。
         * @returns {Record<K, T>} 一个对象，其中键映射到数组中的每个元素。
         *
         * @example
         * const array = [
         *   { category: 'fruit', name: 'apple' },
         *   { category: 'fruit', name: 'banana' },
         *   { category: 'vegetable', name: 'carrot' }
         * ];
         * const result = keyBy(array, item => item.category);
         * // result 将会是:
         * // {
         * //   fruit: { category: 'banana', name: 'apple' },
         * //   vegetable: { category: 'carrot', name: 'vegetable' }
         * // }
         */
        static keyBy<T, K extends PropertyKey>(arr: readonly T[], getKeyFromItem: (item: T) => K): Record<K, T> {
            const result = {} as Record<K, T>;

            for (const item of arr) {
                const key = getKeyFromItem(item);
                result[key] = item;
            }

            return result;
        }

        /**
         * 返回数组的最后一个元素。
         *
         * 该函数接受一个数组，并返回数组的最后一个元素。
         * 如果数组为空，则函数返回 `undefined`。
         *
         * 与某些实现不同，该函数通过直接访问数组的最后一个索引来进行性能优化。
         *
         * @param {T[]} arr - 要获取最后一个元素的数组。
         * @returns {T | undefined} 数组的最后一个元素，如果数组为空则返回 `undefined`。
         *
         * @example
         * const arr = [1, 2, 3];
         * const lastElement = last(arr);
         * // lastElement 将为 3
         *
         * const emptyArr: number[] = [];
         * const noElement = last(emptyArr);
         * // noElement 将为 undefined
         */
        static last<T>(arr: readonly [...T[], T]): T;
        static last<T>(arr: readonly T[]): T | undefined;
        static last<T>(arr: readonly T[]): T | undefined {
            return arr[arr.length - 1];
        }

        /**
         * 找到数组中在应用 getValue 函数到每个元素后具有最大值的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} items 要搜索的元素数组。
         * @param {(element: T) => number} getValue 从每个元素中选择一个数值的函数。
         * @returns {T} 根据 getValue 函数确定的具有最大值的元素。
         * @example
         * maxBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: { a: 3 }
         * maxBy([], x => x.a); // 返回: undefined
         */
        static maxBy<T>(items: T[], getValue: (element: T) => number): T {
            let maxElement = items[0];
            let max = -Infinity;

            for (const element of items) {
                const value = getValue(element);
                if (value > max) {
                    max = value;
                    maxElement = element;
                }
            }

            return maxElement;
        }

        /**
         * 找到数组中在应用 `getValue` 函数到每个元素后具有最小值的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} items 要搜索的元素数组。
         * @param {(element: T) => number} getValue 从每个元素中选择一个数值的函数。
         * @returns {T} 根据 `getValue` 函数确定的具有最小值的元素。
         * @example
         * minBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: { a: 1 }
         * minBy([], x => x.a); // 返回: undefined
         */
        static minBy<T>(items: T[], getValue: (element: T) => number): T {
            let minElement = items[0];
            let min = Infinity;

            for (const element of items) {
                const value = getValue(element);
                if (value < min) {
                    min = value;
                    minElement = element;
                }
            }

            return minElement;
        }

        /**
         * 根据多个属性和对应的排序方向对对象数组进行排序。
         *
         * 此函数接受一个对象数组、一个要排序的键（属性）数组以及一个排序方向数组。
         * 它返回排序后的数组，根据每个键及其对应的方向（'asc' 表示升序，'desc' 表示降序）进行排序。
         * 如果某个键的值相等，则按照下一个键继续确定顺序。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} collection - 要排序的对象数组。
         * @param {Array<keyof T>} keys - 要排序的键（属性）数组。
         * @param {Order[]} orders - 排序方向数组（'asc' 表示升序，'desc' 表示降序）。
         * @returns {T[]} - 排序后的数组。
         *
         * @example
         * // 按 'user' 升序和 'age' 降序对对象数组进行排序。
         * const users = [
         *   { user: 'fred', age: 48 },
         *   { user: 'barney', age: 34 },
         *   { user: 'fred', age: 40 },
         *   { user: 'barney', age: 36 },
         * ];
         * const result = orderBy(users, ['user', 'age'], ['asc', 'desc']);
         * // result 将会是:
         * // [
         * //   { user: 'barney', age: 36 },
         * //   { user: 'barney', age: 34 },
         * //   { user: 'fred', age: 48 },
         * //   { user: 'fred', age: 40 },
         * // ]
         */
        static orderBy<T>(collection: T[], keys: Array<keyof T>, orders: Order[]): T[] {
            const compareValues = (a: T[keyof T], b: T[keyof T], order: Order) => {
                if (a < b) {
                    return order === 'asc' ? -1 : 1;
                }
                if (a > b) {
                    return order === 'asc' ? 1 : -1;
                }
                return 0;
            };

            const effectiveOrders = keys.map((_, index) => orders[index] || orders[orders.length - 1]);

            return collection.slice().sort((a, b) => {
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const order = effectiveOrders[i];
                    const result = compareValues(a[key], b[key], order);
                    if (result !== 0) {
                        return result;
                    }
                }
                return 0;
            });
        }

        /**
         * 根据断言函数将数组分割成两组。
         *
         * 此函数接受一个数组和一个断言函数。它返回一个包含两个数组的元组：
         * 第一个数组包含断言函数返回 true 的元素，第二个数组包含断言函数返回 false 的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要分割的数组。
         * @param {(value: T) => boolean} isInTruthy - 一个断言函数，确定一个元素是否应放入真值数组中。
         * 函数将对数组中的每个元素调用。
         * @returns {[T[], T[]]} 包含两个数组的元组：第一个数组包含断言函数返回 true 的元素，
         * 第二个数组包含断言函数返回 false 的元素。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const isEven = x => x % 2 === 0;
         * const [even, odd] = partition(array, isEven);
         * // even 将为 [2, 4]，odd 将为 [1, 3, 5]
         */
        static partition<T>(arr: readonly T[], isInTruthy: (value: T) => boolean): [truthy: T[], falsy: T[]] {
            const truthy: T[] = [];
            const falsy: T[] = [];

            for (const item of arr) {
                if (isInTruthy(item)) {
                    truthy.push(item);
                } else {
                    falsy.push(item);
                }
            }

            return [truthy, falsy];
        }

        /**
         * 从数组中随机返回一个元素。
         *
         * 此函数接受一个数组并返回数组中随机选择的单个元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要抽样的数组。
         * @returns {T} 数组中随机选取的一个元素。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const randomElement = sample(array);
         * // randomElement 将是数组中随机选择的一个元素。
         */
        static sample<T>(arr: readonly T[]): T {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        }



        /**
         * 返回指定 `size` 大小的数组样本元素。
         *
         * 此函数接受一个数组和一个数字，并使用 Floyd's 算法返回一个包含抽样元素的数组。
         *
         * {@link https://www.nowherenearithaca.com/2013/05/robert-floyds-tiny-and-beautiful.html Floyd's 算法}
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} array - 要从中抽样的数组。
         * @param {number} size - 抽样的大小。
         * @returns {T[]} 应用了样本大小的新数组。
         * @throws {Error} 如果 `size` 大于 `array` 的长度，则抛出错误。
         *
         * @example
         * const result = sampleSize([1, 2, 3], 2)
         * // result 将是包含两个来自数组的元素的数组。
         * // [1, 2] 或 [1, 3] 或 [2, 3]
         */
        static sampleSize<T>(array: readonly T[], size: number): T[] {
            if (size > array.length) {
                throw new Error('Size must be less than or equal to the length of array.');
            }

            const result = new Array(size);
            const selected = new Set();

            for (let step = array.length - size, resultIndex = 0; step < array.length; step++, resultIndex++) {
                let index = OpenAPI.MathUtils.randomInt(0, step + 1);

                if (selected.has(index)) {
                    index = step;
                }

                selected.add(index);

                result[resultIndex] = array[index];
            }

            return result;
        }

        /**
         * 使用 Fisher-Yates 算法随机打乱数组中的元素顺序。
         *
         * 此函数接受一个数组，并返回一个新数组，其中元素以随机顺序进行了洗牌。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要洗牌的数组。
         * @returns {T[]} 元素顺序已随机洗牌的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const shuffledArray = shuffle(array);
         * // shuffledArray 将是一个新数组，其中 array 的元素以随机顺序洗牌，例如 [3, 1, 4, 5, 2]
         */
        static shuffle<T>(arr: readonly T[]): T[] {
            const result = arr.slice();

            /**
             * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
             */
            for (let i = result.length - 1; i >= 1; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }

            return result;
        }

        /**
         * 当输入为单元素数组时返回空数组。
         *
         * @param {readonly [T]} arr - 要处理的单元素数组。
         * @returns {[]} 一个空数组。
         *
         * @example
         * const arr = [1];
         * const result = tail(arr);
         * // result 将是 []
         */
        static tail<T>(arr: readonly [T]): [];

        /**
         * 当输入为空数组时返回空数组。
         *
         * @param {readonly []} arr - 要处理的空数组。
         * @returns {[]} 一个空数组。
         *
         * @example
         * const arr = [];
         * const result = tail(arr);
         * // result 将是 []
         */
        static tail(arr: readonly []): [];

        /**
         * 当输入为元组数组时，返回一个新数组，其中包含除第一个元素之外的所有元素。
         *
         * @param {readonly [T, ...U[]]} arr - 要处理的元组数组。
         * @returns {U[]} 包含输入数组中除第一个元素之外所有元素的新数组。
         *
         * @example
         * const arr = [1, 2, 3];
         * const result = tail(arr);
         * // result 将是 [2, 3]
         */
        static tail<T, U>(arr: readonly [T, ...U[]]): U[];

        /**
         * 返回一个新数组，其中包含除第一个元素之外的所有元素。
         *
         * 此函数接受一个数组并返回一个新数组，其中包含除第一个元素之外的所有元素。
         * 如果输入数组为空或只有一个元素，则返回一个空数组。
         *
         * @param {readonly T[]} arr - 要获取尾部的数组。
         * @returns {T[]} 包含输入数组中除第一个元素之外所有元素的新数组。
         *
         * @example
         * const arr1 = [1, 2, 3];
         * const result = tail(arr1);
         * // result 将是 [2, 3]
         *
         * const arr2 = [1];
         * const result2 = tail(arr2);
         * // result2 将是 []
         *
         * const arr3 = [];
         * const result3 = tail(arr3);
         * // result3 将是 []
         */
        static tail<T>(arr: readonly T[]): T[] {
            const len = arr.length;
            if (len <= 1) {
                return [];
            }
            const result = new Array(len - 1);
            for (let i = 1; i < len; i++) {
                result[i - 1] = arr[i];
            }
            return result;
        }

        /**
         * 返回一个新数组，其中包含输入数组 `arr` 的前 `count` 个元素。
         * 如果 `count` 大于 `arr` 的长度，则返回整个数组。
         *
         * @template T - 输入数组中元素的类型。
         *
         * @param {T[]} arr - 要获取元素的数组。
         * @param {number} count - 要获取的元素数量。
         * @returns {T[]} 包含输入数组 `arr` 的前 `count` 个元素的新数组。
         *
         * @example
         * // 返回 [1, 2, 3]
         * take([1, 2, 3, 4, 5], 3);
         *
         * @example
         * // 返回 ['a', 'b']
         * take(['a', 'b', 'c'], 2);
         *
         * @example
         * // 返回 [1, 2, 3]
         * take([1, 2, 3], 5);
         */
        static take<T>(arr: readonly T[], count: number): T[] {
            return arr.slice(0, count);
        }

        /**
         * 返回一个新数组，其中包含输入数组 `arr` 的后 `count` 个元素。
         * 如果 `count` 大于 `arr` 的长度，则返回整个数组。
         *
         * @template T - 数组中元素的类型。
         *
         * @param {T[]} arr - 要获取元素的数组。
         * @param {number} count - 要获取的元素数量。
         * @returns {T[]} 包含输入数组 `arr` 的后 `count` 个元素的新数组。
         *
         * @example
         * // 返回 [4, 5]
         * takeRight([1, 2, 3, 4, 5], 2);
         *
         * @example
         * // 返回 ['b', 'c']
         * takeRight(['a', 'b', 'c'], 2);
         *
         * @example
         * // 返回 [1, 2, 3]
         * takeRight([1, 2, 3], 5);
         */
        static takeRight<T>(arr: readonly T[], count: number): T[] {
            if (count === 0) {
                return [];
            }

            return arr.slice(-count);
        }

        /**
         * 从数组末尾开始获取元素，直到断言函数返回 `false`。
         *
         * @template T - 输入数组中元素的类型。
         *
         * @param {T[]} arr - 要获取元素的数组。
         * @param {function(T): boolean} shouldContinueTaking - 每个元素调用的断言函数。
         * @returns {T[]} 包含从末尾获取的元素的新数组，直到断言函数返回 `false`。
         *
         * @example
         * // 返回 [3, 2, 1]
         * takeRightWhile([5, 4, 3, 2, 1], n => n < 4);
         *
         * @example
         * // 返回 []
         * takeRightWhile([1, 2, 3], n => n > 3);
         */
        static takeRightWhile<T>(arr: readonly T[], shouldContinueTaking: (item: T) => boolean): T[] {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (!shouldContinueTaking(arr[i])) {
                    return arr.slice(i + 1);
                }
            }

            return arr.slice();
        }

        /**
         * 返回一个新数组，包含满足提供的断言函数的输入数组的前导元素。
         * 当断言函数返回 false 时，停止取元素。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @param {(element: T) => boolean} shouldContinueTaking - 每个元素调用的断言函数。只要该函数返回 true，就会将元素包括在结果中。
         * @returns {T[]} 包含满足断言的前导元素的新数组。
         *
         * @example
         * // 返回 [1, 2]
         * takeWhile([1, 2, 3, 4], x => x < 3);
         *
         * @example
         * // 返回 []
         * takeWhile([1, 2, 3, 4], x => x > 3);
         */
        static takeWhile<T>(arr: readonly T[], shouldContinueTaking: (element: T) => boolean): T[] {
            const result: T[] = [];

            for (const item of arr) {
                if (!shouldContinueTaking(item)) {
                    break;
                }

                result.push(item);
            }

            return result;
        }

        /**
         * 从所有给定数组中创建一个唯一值数组。
         *
         * 此函数接受两个数组，合并它们为一个数组，并返回一个新数组，该数组仅包含合并后的数组中的唯一值。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr1 - 要合并和过滤唯一值的第一个数组。
         * @param {T[]} arr2 - 要合并和过滤唯一值的第二个数组。
         * @returns {T[]} 包含唯一值的新数组。
         *
         * @example
         * const array1 = [1, 2, 3];
         * const array2 = [3, 4, 5];
         * const result = union(array1, array2);
         * // result 将是 [1, 2, 3, 4, 5]
         */
        static union<T>(arr1: readonly T[], arr2: readonly T[]): T[] {
            return this.uniq(arr1.concat(arr2));
        }

        /**
         * 使用提供的映射函数确定相等性，从所有给定数组中创建一个按顺序排列的唯一值数组。
         *
         * @template T - 数组中的元素类型。
         * @template U - 映射后的元素类型。
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @param {(item: T) => U} mapper - 映射数组元素到比较值的函数。
         * @returns {T[]} 包含来自 `arr1` 和 `arr2` 的唯一元素并按照映射值确定顺序的新数组。
         *
         * @example
         * // 用于数字的自定义映射函数（取模比较）
         * const moduloMapper = (x) => x % 3;
         * unionBy([1, 2, 3], [4, 5, 6], moduloMapper);
         * // 返回 [1, 2, 3]
         *
         * @example
         * // 用于带有 'id' 属性的对象的自定义映射函数
         * const idMapper = (obj) => obj.id;
         * unionBy([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], idMapper);
         * // 返回 [{ id: 1 }, { id: 2 }, { id: 3 }]
         */
        static unionBy<T, U>(arr1: readonly T[], arr2: readonly T[], mapper: (item: T) => U): T[] {
            const map = new Map<U, T>();

            for (const item of [...arr1, ...arr2]) {
                const key = mapper(item);

                if (!map.has(key)) {
                    map.set(key, item);
                }
            }

            return Array.from(map.values());
        }

        /**
         * 基于自定义相等性函数，从两个给定数组中创建一个唯一值数组。
         *
         * 此函数接受两个数组和一个自定义相等性函数，合并数组，并返回一个新数组，
         * 该数组仅包含根据自定义相等性函数确定的唯一值。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr1 - 第一个数组，用于合并和过滤唯一值。
         * @param {T[]} arr2 - 第二个数组，用于合并和过滤唯一值。
         * @param {(item1: T, item2: T) => boolean} areItemsEqual - 用于确定两个元素是否相等的自定义函数。
         * 它接受两个参数，如果元素被视为相等，则返回 `true`，否则返回 `false`。
         * @returns {T[]} 基于自定义相等性函数的唯一值数组。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }];
         * const array2 = [{ id: 2 }, { id: 3 }];
         * const areItemsEqual = (a, b) => a.id === b.id;
         * const result = unionWith(array1, array2, areItemsEqual);
         * // result 将为 [{ id: 1 }, { id: 2 }, { id: 3 }]，因为 { id: 2 } 在两个数组中被认为是相等的
         */
        static unionWith<T>(
            arr1: readonly T[],
            arr2: readonly T[],
            areItemsEqual: (item1: T, item2: T) => boolean
        ): T[] {
            return this.uniqWith(arr1.concat(arr2), areItemsEqual);
        }

        /**
         * 创建一个去重后的数组版本。
         *
         * 此函数接受一个数组，并返回一个新数组，其中仅包含原始数组中的唯一值，
         * 保留第一次出现的顺序。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @returns {T[]} 仅包含原始数组中唯一值的新数组。
         *
         * @example
         * const array = [1, 2, 2, 3, 4, 4, 5];
         * const result = uniq(array);
         * // result 将为 [1, 2, 3, 4, 5]
         */
        static uniq<T>(arr: readonly T[]): T[] {
            return Array.from(new Set(arr));
        }

        /**
         * 根据映射函数返回的值，返回一个仅包含原始数组中唯一元素的新数组。
         *
         * @template T - 数组中的元素类型。
         * @template U - 映射后的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @param {(item: T) => U} mapper - 用于转换数组元素的函数。
         * @returns {T[]} 返回一个新数组，仅包含原始数组中根据映射函数返回值唯一的元素。
         *
         * @example
         * ```ts
         * uniqBy([1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19], Math.floor);
         * // [1.2, 2.1, 3.3, 5.7, 7.19]
         * ```
         */
        static uniqBy<T, U>(arr: readonly T[], mapper: (item: T) => U): T[] {
            const map = new Map<U, T>();

            for (const item of arr) {
                const key = mapper(item);

                if (!map.has(key)) {
                    map.set(key, item);
                }
            }

            return Array.from(map.values());
        }

        /**
         * 根据比较函数返回的值，返回一个仅包含原始数组中唯一元素的新数组。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @param {(item1: T, item2: T) => boolean} areItemsEqual - 用于比较数组元素的函数。
         * @returns {T[]} 返回一个新数组，仅包含原始数组中根据比较函数返回值唯一的元素。
         *
         * @example
         * ```ts
         * uniqWith([1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19], (a, b) => Math.abs(a - b) < 1);
         * // [1.2, 3.2, 5.7, 7.19]
         * ```
         */
        static uniqWith<T>(arr: readonly T[], areItemsEqual: (item1: T, item2: T) => boolean): T[] {
            const result: T[] = [];

            for (const item of arr) {
                const isUniq = result.every(v => !areItemsEqual(v, item));

                if (isUniq) {
                    result.push(item);
                }
            }

            return result;
        }

        /**
         * 将分组数组中相同位置的元素收集到一个新数组中并返回。
         *
         * @param zipped - 要解压的嵌套数组。
         * @returns 返回一个新的解压后的元素数组。
         *
         * @example
         * const zipped = [['a', true, 1],['b', false, 2]];
         * const result = unzip(zipped);
         * // result 将是 [['a', 'b'], [true, false], [1, 2]]
         */
        static unzip<T extends unknown[]>(zipped: Array<[...T]>): Unzip<T> {
            // 由于性能原因，使用这个实现代替 const maxLen = Math.max(...zipped.map(arr => arr.length));
            let maxLen = 0;

            for (let i = 0; i < zipped.length; i++) {
                if (zipped[i].length > maxLen) {
                    maxLen = zipped[i].length;
                }
            }

            const result = new Array(maxLen) as Unzip<T>;

            for (let i = 0; i < maxLen; i++) {
                result[i] = new Array(zipped.length);
                for (let j = 0; j < zipped.length; j++) {
                    result[i][j] = zipped[j][i];
                }
            }

            return result;
        }

        /**
         * 解压数组的数组，并应用一个迭代函数来重新分组元素。
         *
         * @template T, R
         * @param {T[][]} target - 要解压的嵌套数组。这是一个数组的数组，
         * 每个内部数组包含要解压的元素。
         * @param {(...args: T[]) => R} iteratee - 用于转换解压元素的函数。
         * @returns {R[]} 包含解压和转换后的元素的新数组。
         *
         * @example
         * const nestedArray = [[1, 2], [3, 4], [5, 6]];
         * const result = unzipWith(nestedArray, (item, item2, item3) => item + item2 + item3);
         * // result 将是 [9, 12]
         */
        static unzipWith<T, R>(target: readonly T[][], iteratee: (...args: T[]) => R): R[] {
            const maxLength = Math.max(...target.map(innerArray => innerArray.length));
            const result: R[] = new Array(maxLength);

            for (let i = 0; i < maxLength; i++) {
                const group = new Array(target.length);

                for (let j = 0; j < target.length; j++) {
                    group[j] = target[j][i];
                }

                result[i] = iteratee(...group);
            }

            return result;
        }

        /**
         * 创建一个排除所有指定值的数组。
         *
         * 它使用 [SameValueZero](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero) 正确排除 `NaN`。
         *
         * @template T 数组中元素的类型。
         * @param {T[]} array - 要过滤的数组。
         * @param {...T[]} values - 要排除的值。
         * @returns {T[]} 不包含指定值的新数组。
         *
         * @example
         * // 从数组中移除指定的值
         * without([1, 2, 3, 4, 5], 2, 4);
         * // 返回: [1, 3, 5]
         *
         * @example
         * // 从数组中移除指定的字符串值
         * without(['a', 'b', 'c', 'a'], 'a');
         * // 返回: ['b', 'c']
         */
        static without<T>(array: readonly T[], ...values: T[]): T[] {
            const valuesSet = new Set(values);
            return array.filter(item => !valuesSet.has(item));
        }

        /**
         * 计算两个数组之间的对称差异。对称差异是两个数组中存在的元素集合，
         * 即存在于其中一个数组中，但不在它们的交集中。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @returns {T[]} 包含存在于 `arr1` 或 `arr2` 中但不在两者交集中的元素的数组。
         *
         * @example
         * // 返回 [1, 2, 5, 6]
         * xor([1, 2, 3, 4], [3, 4, 5, 6]);
         *
         * @example
         * // 返回 ['a', 'c']
         * xor(['a', 'b'], ['b', 'c']);
         */
        static xor<T>(arr1: readonly T[], arr2: readonly T[]): T[] {
            return this.difference(this.union(arr1, arr2), this.intersection(arr1, arr2));
        }

        /**
         * 使用自定义映射函数计算两个数组之间的对称差异。
         * 对称差异是两个数组中存在的元素集合，即存在于其中一个数组中，但不在它们的交集中，
         * 根据映射函数返回的值确定。
         *
         * @template T - 输入数组中元素的类型。
         * @template U - 映射函数返回的值的类型。
         *
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @param {(item: T) => U} mapper - 将数组元素映射到比较值的函数。
         * @returns {T[]} 包含存在于 `arr1` 或 `arr2` 中但不在两者交集中的元素的数组，
         * 基于映射函数返回的值。
         *
         * @example
         * // 对象数组的自定义映射函数
         * const idMapper = obj => obj.id;
         * xorBy([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], idMapper);
         * // 返回 [{ id: 1 }, { id: 3 }]
         */
        static xorBy<T, U>(arr1: readonly T[], arr2: readonly T[], mapper: (item: T) => U): T[] {
            const union = this.unionBy(arr1, arr2, mapper);
            const intersection = this.intersectionBy(arr1, arr2, mapper);

            return this.differenceBy(union, intersection, mapper);
        }
        /**
         * 使用自定义相等函数计算两个数组之间的对称差异。
         * 对称差异是两个数组中存在的元素集合，即存在于其中一个数组中，但不在它们的交集中，
         * 根据自定义相等函数确定。
         *
         * @template T - 输入数组中元素的类型。
         *
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @param {(item1: T, item2: T) => boolean} areElementsEqual - 用于比较元素的自定义相等函数。
         * @returns {T[]} 包含存在于 `arr1` 或 `arr2` 中但不在两者交集中的元素的数组，
         * 基于自定义相等函数。
         *
         * @example
         * // 对象数组的自定义相等函数，比较 'id' 属性
         * const areObjectsEqual = (a, b) => a.id === b.id;
         * xorWith([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], areObjectsEqual);
         * // 返回 [{ id: 1 }, { id: 3 }]
         */
        static xorWith<T>(
            arr1: readonly T[],
            arr2: readonly T[],
            areElementsEqual: (item1: T, item2: T) => boolean
        ): T[] {
            const union = this.unionWith(arr1, arr2, areElementsEqual);
            const intersection = this.intersectionWith(arr1, arr2, areElementsEqual);

            return this.differenceWith(union, intersection, areElementsEqual);
        }

        /**
         * 将多个数组组合成一个元组数组。
         *
         * 此函数接受多个数组并返回一个新数组，其中每个元素都是一个元组，包含来自输入数组的相应元素。
         * 如果输入数组的长度不同，则结果数组将具有最长输入数组的长度，缺少元素的位置将使用 undefined 值填充。
         *
         * @param {...T[][]} arrs - 要合并的数组。
         * @returns {T[][]} 包含来自输入数组的相应元素的元组数组。
         *
         * @example
         * const arr1 = [1, 2, 3];
         * const arr2 = ['a', 'b', 'c'];
         * const result = zip(arr1, arr2);
         * // result 将会是 [[1, 'a'], [2, 'b'], [3, 'c']]
         *
         * const arr3 = [true, false];
         * const result2 = zip(arr1, arr2, arr3);
         * // result2 将会是 [[1, 'a', true], [2, 'b', false], [3, 'c', undefined]]
         */
        static zip<T>(arr1: readonly T[]): Array<[T]>;
        static zip<T, U>(arr1: readonly T[], arr2: readonly U[]): Array<[T, U]>;
        static zip<T, U, V>(arr1: readonly T[], arr2: readonly U[], arr3: readonly V[]): Array<[T, U, V]>;
        static zip<T, U, V, W>(
            arr1: readonly T[],
            arr2: readonly U[],
            arr3: readonly V[],
            arr4: readonly W[]
        ): Array<[T, U, V, W]>;
        static zip<T>(...arrs: Array<readonly T[]>): T[][] {
            const result: T[][] = [];

            const maxIndex = Math.max(...arrs.map(x => x.length));

            for (let i = 0; i < maxIndex; i++) {
                const element: T[] = [];

                for (const arr of arrs) {
                    element.push(arr[i]);
                }

                result.push(element);
            }

            return result;
        }

        /**
         * 将两个数组（一个包含属性名，另一个包含对应的值）组合成一个对象。
         *
         * 此函数接受两个数组：一个包含属性名，另一个包含对应的值。
         * 它返回一个新对象，其中第一个数组中的属性名作为键，第二个数组中对应的元素作为值。
         * 如果 `keys` 数组的长度大于 `values` 数组的长度，剩余的键将会使用 `undefined` 作为它们的值。
         *
         * @template P - 数组元素的类型。
         * @template V - 数组元素的类型。
         * @param {P[]} keys - 属性名数组。
         * @param {V[]} values - 与属性名对应的值数组。
         * @returns {{ [K in P]: V }} 组合后的对象，包含给定的属性名和对应的值。
         *
         * @example
         * const keys = ['a', 'b', 'c'];
         * const values = [1, 2, 3];
         * const result = zipObject(keys, values);
         * // result 将会是 { a: 1, b: 2, c: 3 }
         *
         * const keys2 = ['a', 'b', 'c'];
         * const values2 = [1, 2];
         * const result2 = zipObject(keys2, values2);
         * // result2 将会是 { a: 1, b: 2, c: undefined }
         *
         * const keys2 = ['a', 'b'];
         * const values2 = [1, 2, 3];
         * const result2 = zipObject(keys2, values2);
         * // result2 将会是 { a: 1, b: 2 }
         */
        static zipObject<P extends string | number | symbol, V>(keys: P[], values: V[]): { [K in P]: V } {
            const result = {} as { [K in P]: V };

            for (let i = 0; i < keys.length; i++) {
                result[keys[i]] = values[i];
            }

            return result;
        }


        /**
         * 使用自定义组合函数将多个数组组合成单个数组。
         *
         * 此函数接受多个数组和一个组合函数，并返回一个新数组，其中每个元素
         * 是将组合函数应用于输入数组的对应元素的结果。
         *
         * @param {T[]} arr1 - 第一个要组合的数组。
         * @param {U[]} [arr2] - 第二个要组合的数组（可选）。
         * @param {V[]} [arr3] - 第三个要组合的数组（可选）。
         * @param {W[]} [arr4] - 第四个要组合的数组（可选）。
         * @param {(...items: T[]) => R} combine - 接受对应元素并返回单个值的组合函数。
         * @returns {R[]} 一个新数组，其中每个元素是将组合函数应用于输入数组的对应元素的结果。
         *
         * @example
         * // 使用两个数组的示例：
         * const arr1 = [1, 2, 3];
         * const arr2 = [4, 5, 6];
         * const result = zipWith(arr1, arr2, (a, b) => a + b);
         * // result 将会是 [5, 7, 9]
         *
         * @example
         * // 使用三个数组的示例：
         * const arr1 = [1, 2];
         * const arr2 = [3, 4];
         * const arr3 = [5, 6];
         * const result = zipWith(arr1, arr2, arr3, (a, b, c) => `${a}${b}${c}`);
         * // result 将会是 [`135`, `246`]
         */
        static zipWith<T, R>(arr1: readonly T[], combine: (item: T) => R): R[];
        static zipWith<T, U, R>(arr1: readonly T[], arr2: readonly U[], combine: (item1: T, item2: U) => R): R[];
        static zipWith<T, U, V, R>(
            arr1: readonly T[],
            arr2: readonly U[],
            arr3: readonly V[],
            combine: (item1: T, item2: U, item3: V) => R
        ): R[];
        static zipWith<T, U, V, W, R>(
            arr1: readonly T[],
            arr2: readonly U[],
            arr3: readonly V[],
            arr4: readonly W[],
            combine: (item1: T, item2: U, item3: V, item4: W) => R
        ): R[];
        static zipWith<T, R>(arr1: readonly T[], ...rest: any[]): R[] {
            const arrs = [arr1, ...rest.slice(0, -1)];
            const combine = rest[rest.length - 1] as (...items: T[]) => R;

            const result: R[] = [];
            const maxIndex = Math.max(...arrs.map(arr => arr.length));

            for (let i = 0; i < maxIndex; i++) {
                const elements: T[] = arrs.map(arr => arr[i]);
                result.push(combine(...elements));
            }

            return result;
        }

    }
}
module OpenAPI {
  /**
   * Javascript Clipper
   * @version 6.4.2
   */
  export class Clipper {
    /**
     * Clipper库，需要先执行init才能拿到库内容
     */
    static ClipperLib: any

    /**
     * 初始化
     */
    static Init() {
      Clipper.ClipperLib = OpenAPI.Require.Init('clipper')
    }

    /**
     * 定义点转换函数
     */
    static toClipperPoints(points: { x: number; y: number }[]) {
      return points.map(point => ({ X: point.x, Y: point.y }))
    }

    /**
     *  判断两个多边形是否相交的函数
     */
    static polygonsIntersect(polygon1: { X: number; Y: number }[], polygon2: { X: number; Y: number }[]) {
      // 创建 Clipper 实例
      const ClipperLib = OpenAPI.Clipper.ClipperLib
      const clipper = new ClipperLib.Clipper()

      // 将多边形路径添加到 Clipper 实例中
      clipper.AddPath(polygon1, ClipperLib.PolyType.ptSubject, true)
      clipper.AddPath(polygon2, ClipperLib.PolyType.ptClip, true)

      // 执行相交判断
      const solution = new ClipperLib.Paths()
      clipper.Execute(ClipperLib.ClipType.ctIntersection, solution)

      // 如果有交点，说明两个多边形相交
      return solution.length > 0
    }
  }
}
module OpenAPI{
    /**
     * 常量操作工具
     */
    export class ConstantsUtils{
        static CASE_SPLIT_PATTERN = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
    }
}module OpenAPI {

    /**
     * 光标工具
     */
    export class CursorUtils {

        /**
         * 光标系统样式名称
         * 
         * @example
         * const cursorStyle = OpenAPI.CursorUtils.cursorSystemStyleName // 返回 ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize']
         */
        static get cursorSystemStyleName(): ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'] {
            return OpenAPI.Method.cursorSystemStyleName as any;
        }
    }
}
module OpenAPI {
    /**
     * 日期工具
     */
    export class DateUtils {

        /**
         * 日期转时间戳
         * 
         * @param {string} date - 日期
         * 
         * @example
         * const timestamp = dateToTimestamp('2024-01-01') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024/01/01') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024-01-01 00:00:00') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024/01/01 00:00:00') // 返回 1704038400000
         */
        static dateToTimestamp = (date: string): number => {
            return OpenAPI.Method.dateToTimestamp(date);
        };

        /**
         * 时间戳转日期
         * 
         * @param {number} timestamp - 时间戳
         * @param {string} data_type - 返回的数据类型 默认返回 '2024/01/01 00:00:00'
         * 
         * @example
         * const date = timestampToDate(1704038400000) // 返回 '2024/01/01 00:00:00'
         * const date = timestampToDate(1704038400000, 'y') // 返回 '2024'
         */
        static timestampToDate = (timestamp: number, data_type: '' | 'y' | 'm' | 'd' | 'h' | 'i' | 's' = ''): string | number | undefined => {
            return OpenAPI.Method.timestampToDate(timestamp, data_type);
        }
    }
}module OpenAPI {
    /**
     * 表示一个中止操作的错误类。
     * @augments Error
     */
    export class AbortError extends Error {
        constructor(message = 'The operation was aborted') {
            super(message);
            this.name = 'AbortError';
        }
    }
}module OpenAPI {
    /**
     * 事件工具
     */
    export class EventUtils {

        /**
         * 获取事件页名称
         * 
         * @example
         * 
         */
        static eventPageName(eventPage: string): string | null {
            return OpenAPI.Method.getFeDataMessage(eventPage);
        }
    }
}module OpenAPI {
    /**
     * 函数操作工具
     */
    export class FunctionUtils {

        /**
         * 创建一个防抖函数，延迟调用提供的函数，直到上次调用后已经过去了 `debounceMs` 毫秒。
         * 防抖函数还具有一个 `cancel` 方法，用于取消任何待执行的函数调用。
         *
         * @template F - 函数的类型。
         * @param {F} func - 要防抖的函数。
         * @param {number} debounceMs - 延迟的毫秒数。
         * @param {DebounceOptions} options - 选项对象。
         * @param {AbortSignal} options.signal - 可选的 AbortSignal，用于取消防抖函数的执行。
         * @returns {F & { cancel: () => void }} - 一个具有 `cancel` 方法的新防抖函数。
         *
         * @example
         * const debouncedFunction = debounce(() => {
         *   console.log('Function executed');
         * }, 1000);
         *
         * // 如果在1秒内未再次调用，则会记录 'Function executed'
         * debouncedFunction();
         *
         * // 不会记录任何内容，因为之前的调用被取消了
         * debouncedFunction.cancel();
         *
         * // 使用 AbortSignal
         * const controller = new AbortController();
         * const signal = controller.signal;
         * const debouncedWithSignal = debounce(() => {
         *  console.log('Function executed');
         * }, 1000, { signal });
         *
         * debouncedWithSignal();
         *
         * // 将取消防抖函数的调用
         * controller.abort();
         */
        static debounce<F extends (...args: any[]) => void>(
            func: F,
            debounceMs: number,
            { signal }: { signal?: AbortSignal } = {}
        ): F & { cancel: () => void } {
            let timeoutId: number | null = null;

            const debounced = function (...args: Parameters<F>) {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                }

                if (signal?.aborted) {
                    return;
                }

                timeoutId = setTimeout(() => {
                    func(...args);
                    timeoutId = null;
                }, debounceMs) as any;
            } as F & { cancel: () => void };

            const onAbort = function () {
                debounced.cancel();
            };

            debounced.cancel = function () {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            };

            signal?.addEventListener('abort', onAbort, { once: true });

            return debounced;
        }

        /**
         * 一个什么也不做的空操作函数。
         * 可以用作占位符或默认函数。
         *
         * @example
         * noop(); // 什么也不做
         *
         * @returns {void} 此函数不返回任何内容。
         */
        static noop(): void { }

        /**
         * 创建一个仅允许调用提供的函数 `func` 一次的函数。
         * 对该函数的重复调用将返回第一次调用的返回值。
         *
         * @template F - 函数的类型。
         * @param {F} func - 要限制的函数。
         * @returns {F} 一个新函数，调用 `func` 一次并缓存结果。
         *
         * @example
         * const initialize = once(() => {
         *   console.log('Initialized!');
         *   return true;
         * });
         *
         * initialize(); // 输出：'Initialized!' 并返回 true
         * initialize(); // 返回 true，但不输出日志
         */
        static once<F extends () => any>(func: F): F {
            let called = false;
            let cache: ReturnType<F> | undefined;

            return function () {
                if (called) {
                    return cache;
                }

                const result = func();

                called = true;
                cache = result;

                return result;
            } as F;
        }

        /**
         * 创建一个节流函数，每隔 `throttleMs` 毫秒最多调用一次提供的函数。
         * 在等待时间内对节流函数的连续调用将不会触发原始函数的执行。
         *
         * @template F - 函数的类型。
         * @param {F} func - 要节流的函数。
         * @param {number} throttleMs - 以毫秒为单位的节流执行间隔。
         * @returns {F} 一个新的节流函数，接受与原始函数相同的参数。
         *
         * @example
         * const throttledFunction = throttle(() => {
         *   console.log('Function executed');
         * }, 1000);
         *
         * // 立即输出：'Function executed'
         * throttledFunction();
         *
         * // 在节流时间内，不会输出任何内容
         * throttledFunction();
         *
         * // 1 秒后
         * setTimeout(() => {
         *   throttledFunction(); // 输出：'Function executed'
         * }, 1000);
         */
        static throttle<F extends (...args: any[]) => void>(func: F, throttleMs: number): F {
            let lastCallTime: number | null;

            const throttledFunction = function (...args: Parameters<F>) {
                const now = Date.now();

                if (lastCallTime == null || now - lastCallTime >= throttleMs) {
                    lastCallTime = now;
                    func(...args);
                }
            } as F;

            return throttledFunction;
        }
    }
}module OpenAPI {

  /**
   * GameCreator相关API
   */
  export class GC {
    /**
     * GC平台相关API
     */
    static Cloud = {

      /**
       * 是否是GC平台
       */
      get isInGCCloud(): boolean {
        return window.location.href.includes('gamecreator')
      },

      /**
       * 游戏ID
       */
      get GameID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/').pop()
        if (!releaseProject)
          return 0
        const split = releaseProject.split('/')
        const shift = split.shift()
        if (!shift)
          return 0
        const p = shift.split('_')
        return Number.parseInt(p[1])
      },

      /**
       * 游戏名称
       */
      get GameName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        const title = document.querySelector('title')
        if (!title)
          return ''
        const name = title.innerText
        const keywords = document.querySelector('meta[name="keywords"]')
        if (!keywords)
          return ''
        let p = keywords.getAttribute('content')
        const remove = `${name} | `
        if (p && p.startsWith(remove)) {
          p = p.replace(remove, '')
          return p
        }
        else {
          return ''
        }
      },

      /**
       * 当前版本号
       */
      get GameVersion(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/')
        const pop = releaseProject.pop()
        if (!pop)
          return 0
        const p = pop.split('/')
        return Number.parseInt(p[1])
      },

      /**
       * 作者ID
       */
      get AuthorUID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/')
        const pop = releaseProject.pop()
        if (!pop)
          return 0
        const split = pop.split('/')
        if (!split)
          return 0
        const shift = split.shift()
        if (!shift)
          return 0
        const p = shift.split('_')
        return Number.parseInt(p[0])
      },

      /**
       * 作者名称
       */
      get AuthorName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        const title = document.querySelector('title')
        if (!title)
          return ''
        const p = title.innerText
        return p
      },

    }

    /**
     * 如果是编辑器则弹窗, 如果是发布后则输出
     */
    static isCloudLog(text: any): void {
      if (Config.RELEASE_GAME)
        trace(text)

      else
        alert(text)
    }
  }

}
module OpenAPI {
    /**
     * UI操作工具
     */
    export class InterfaceUtils {
        /**
         * 封装数值类型的输入值
         * @param ui UI根节点
         * @param comp 输入组件
         * @param value 输入值
         * @param min 最小值
         * @param max 最大值
         * @param sub 减少按钮
         * @param add 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        static NumberInput(ui: UIRoot, comp: UIInput, value: number, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值不允许为空
            if (!value) {
                value = 0;
            }
            let numValue: number = value;

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);

            if (subBtn) {
                // 减少按钮点击事件
                subBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputSubClick);
                subBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputSubClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            if (addBtn) {
                // 增加按钮点击事件
                addBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputAddClick);
                addBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputAddClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            if (minBtn) {
                // 最小值按钮点击事件
                minBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMinClick);
                minBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMinClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            if (maxBtn) {
                // 最大值按钮点击事件
                maxBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMaxClick);
                maxBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMaxClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            // 输入值输入事件
            comp.off(EventObject.INPUT, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.INPUT, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);

            // 输入值失去焦点事件
            comp.off(EventObject.BLUR, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.BLUR, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);

            // 输入值改变事件
            comp.off(EventObject.CHANGE, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.CHANGE, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);

            // 输入值获得焦点事件
            comp.off(EventObject.FOCUS, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.FOCUS, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
        }

        /**
         * 减少按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputSubClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值转换为数值
            let numValue: number = Number(comp.text);

            // 输入值减少
            numValue--;

            // 输入值小于最小值
            if (numValue < min) {
                numValue = min;
            }

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 增加按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputAddClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值转换为数值
            let numValue: number = Number(comp.text);

            // 输入值增加
            numValue++;

            // 输入值大于最大值
            if (numValue > max) {
                numValue = max;
            }

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 最小值按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputMinClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = min;

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 最大值按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputMaxClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = max;

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 输入值改变事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInput(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = Number(comp.text);

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 检查输入值状态
         * @param value 输入值
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputCheck(value: number, comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = value;

            // 输入值小于最小值
            if (numValue < min) {
                numValue = min;
            }

            // 输入值大于最大值
            if (numValue > max) {
                numValue = max;
            }

            // 输入值赋值
            comp.text = numValue.toString();

            if (subBtn) {
                // 最小值情况下，启用减少按钮
                subBtn.disabled = numValue <= min;
            }

            if (addBtn) {
                // 最大值情况下，启用增加按钮
                addBtn.disabled = numValue >= max;
            }

            if (minBtn) {
                // 最小值情况下，禁用最小值按钮
                minBtn.disabled = numValue <= min;
            }

            if (maxBtn) {
                // 最大值情况下，禁用最大值按钮
                maxBtn.disabled = numValue >= max;
            }
        }
    }
}module OpenAPI {
    /**
     * 数学操作工具工具
     */
    export class MathUtils {

        /**
         * 将一个数字限制在包括的下限和上限范围内。
         *
         * 此函数接受一个数字和两个边界，并返回限制在指定边界内的数字。
         * 如果只提供一个边界，则返回值与该边界的最小值相比较。
         *
         * @param {number} value - 要限制的数字。
         * @param {number} minimum - 要限制的最小边界。
         * @param {number} maximum - 要限制的最大边界。
         * @returns {number} 在指定边界内限制后的数字。
         *
         * @example
         * const result1 = clamp(10, 5); // result1 将会是 5，因为 10 被限制在边界 5 上
         * const result2 = clamp(10, 5, 15); // result2 将会是 10，因为它在边界 5 和 15 内
         * const result3 = clamp(2, 5, 15); // result3 将会是 5，因为 2 被限制在边界 5 下
         * const result4 = clamp(20, 5, 15); // result4 将会是 15，因为 20 被限制在边界 15 上
         */
        static clamp(value: number, maximum: number): number;
        static clamp(value: number, minimum: number, maximum: number): number;
        static clamp(value: number, bound1: number, bound2?: number): number {
            if (bound2 == null) {
                return Math.min(value, bound1);
            }

            return Math.min(Math.max(value, bound1), bound2);
        }

        /**
         * 检查值是否在指定范围内。
         *
         * @param {number} value 要检查的值。
         * @param {number} minimum 范围的下限（包含）。
         * @param {number} maximum 范围的上限（不包含）。
         * @returns {boolean} 如果值在指定范围内则返回 `true`，否则返回 `false`。
         * @throws {Error} 如果 `minimum` 大于或等于 `maximum`，抛出错误。
         *
         * @example
         * const result1 = inRange(3, 5); // result1 将返回 true。
         * const result2 = inRange(1, 2, 5); // result2 将返回 false。
         * const result3 = inRange(1, 5, 2); // 如果最小值大于或等于最大值，将抛出错误。
         */
        static inRange(value: number, maximum: number): boolean;
        static inRange(value: number, minimum: number, maximum: number): boolean;
        static inRange(value: number, minimum: number, maximum?: number): boolean {
            if (maximum == null) {
                maximum = minimum;
                minimum = 0;
            }

            if (minimum >= maximum) {
                throw new Error('The maximum value must be greater than the minimum value.');
            }

            return minimum <= value && value < maximum;
        }

        /**
         * 计算数字数组的平均值。
         *
         * 如果数组为空，该函数返回 `NaN`。
         *
         * @param {number[]} nums - 要计算平均值的数字数组。
         * @returns {number} 数组中所有数字的平均值。
         *
         * @example
         * const numbers = [1, 2, 3, 4, 5];
         * const result = mean(numbers);
         * // result 将为 3
         */
        static mean(nums: readonly number[]): number {
            return this.sum(nums) / nums.length;
        }

        /**
         * 使用 `getValue` 函数对数组中的每个元素应用后，计算数字数组的平均值。
         *
         * 如果数组为空，该函数返回 `NaN`。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} items 要计算平均值的数组。
         * @param {(element: T) => number} getValue 从每个元素中选择数字值的函数。
         * @returns {number} 根据 `getValue` 函数确定的所有数字的平均值。
         *
         * @example
         * meanBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: 2
         * meanBy([], x => x.a); // 返回: NaN
         */
        static meanBy<T>(items: readonly T[], getValue: (element: T) => number): number {
            const nums = items.map(x => getValue(x));

            return this.mean(nums);
        }

        /**
         * 在给定范围内生成一个随机数。
         *
         * 如果只提供一个参数，则返回介于 `0` 和给定数字之间的随机数。
         *
         * @param {number} minimum - 下限值（包含）。
         * @param {number} maximum - 上限值（不包含）。
         * @returns {number} 在最小值（包含）和最大值（不包含）之间的随机数。返回的数可以是整数或小数。
         * @throws {Error} 如果 `maximum` 不大于 `minimum`，则抛出错误。
         *
         * @example
         * const result1 = random(0, 5); // 返回介于 0 和 5 之间的随机数。
         * const result2 = random(5, 0); // 如果最小值大于最大值，则抛出错误。
         * const result3 = random(5, 5); // 如果最小值等于最大值，则抛出错误。
         */
        static random(maximum: number): number;
        static random(minimum: number, maximum: number): number;
        static random(minimum: number, maximum?: number): number {
            if (maximum == null) {
                maximum = minimum;
                minimum = 0;
            }

            if (minimum >= maximum) {
                throw new Error('Invalid input: The maximum value must be greater than the minimum value.');
            }

            return Math.random() * (maximum - minimum) + minimum;
        }

        /**
         * 在最小值（包含）和最大值（不包含）之间生成一个随机整数。
         *
         * 如果只提供一个参数，则返回介于 `0` 和给定数字之间的随机数。
         *
         * @param {number} minimum - 下限值（包含）。
         * @param {number} maximum - 上限值（不包含）。
         * @returns {number} 在最小值（包含）和最大值（不包含）之间的随机整数。
         * @throws {Error} 如果 `maximum` 不大于 `minimum`，则抛出错误。
         *
         * @example
         * const result = randomInt(0, 5); // result 将是介于 0（包含）和 5（不包含）之间的随机整数
         * const result2 = randomInt(5, 0); // 这将抛出错误
         */
        static randomInt(maximum: number): number;
        static randomInt(minimum: number, maximum: number): number;
        static randomInt(minimum: number, maximum?: number): number {
            return Math.floor(this.random(minimum, maximum!));
        }

        /**
         * 返回从 `start` 到 `end` 的数字数组，步长为 `step`。
         *
         * 如果未提供 `step`，默认为 `1`。
         *
         * @param {number} start - 范围的起始数字（包含）。
         * @param {number} [end] - 范围的结束数字（不包含）。
         * @param {number} [step] - 范围的步长值。默认为 `1`。
         * @returns {number[]} 包含从 `start` 到 `end` 的数字数组，步长为 `step`。
         *
         * @example
         * // 返回 [0, 1, 2, 3]
         * range(4);
         *
         * @example
         * // 返回 [0, 5, 10, 15]
         * range(0, 20, 5);
         *
         * @example
         * // 返回 [0, -1, -2, -3]
         * range(0, -4, -1);
         *
         * @example
         * // 抛出错误: 步长值必须是非零整数。
         * range(1, 4, 0);
         */
        static range(end: number): number[];
        static range(start: number, end: number): number[];
        static range(start: number, end: number, step: number): number[];
        static range(start: number, end?: number, step?: number): number[] {
            if (end == null) {
                end = start;
                start = 0;
            }

            if (step == null) {
                step = 1;
            }

            if (!Number.isInteger(step) || step === 0) {
                throw new Error(`The step value must be a non-zero integer.`);
            }

            const length = Math.max(Math.ceil((end - start) / step), 0);
            const result = new Array(length);

            for (let i = 0; i < length; i++) {
                result[i] = start + i * step;
            }

            return result;
        }

        /**
         * 将一个数字四舍五入到指定的精度。
         *
         * 此函数接受一个数字和一个可选的精度值，并返回四舍五入到指定小数位数的数字。
         *
         * @param {number} value - 要四舍五入的数字。
         * @param {number} [precision=0] - 要四舍五入的小数位数。默认为 `0`。
         * @returns {number} 四舍五入后的数字。
         * @throws {Error} 如果 `precision` 不是整数，则抛出错误。
         *
         * @example
         * const result1 = round(1.2345); // result1 将是 1
         * const result2 = round(1.2345, 2); // result2 将是 1.23
         * const result3 = round(1.2345, 3); // result3 将是 1.235
         * const result4 = round(1.2345, 3.1); // 这将抛出一个错误
         */
        static round(value: number, precision = 0): number {
            if (!Number.isInteger(precision)) {
                throw new Error('Precision must be an integer.');
            }
            const multiplier = Math.pow(10, precision);
            return Math.round(value * multiplier) / multiplier;
        }

        /**
         * 计算数组中数字的总和。
         *
         * 此函数接受一个数字数组，并返回数组中所有元素的总和。
         *
         * @param {number[]} nums - 要求和的数字数组。
         * @returns {number} 数组中所有数字的总和。
         *
         * @example
         * const numbers = [1, 2, 3, 4, 5];
         * const result = sum(numbers);
         * // result 将为 15
         */
        static sum(nums: readonly number[]): number {
            let result = 0;

            for (const num of nums) {
                result += num;
            }

            return result;
        }
    }
}module OpenAPI {

  /**
   * 通用API
   */
  export class Method {
    /**
     * 当前页面协议
     * @ "http://" : "https://"
     */
    static get Origin(): string {
      return window.location.protocol === 'http:' ? 'http://' : 'https://'
    }

    /**
     * 随机字符串
     * @param {number} len 随机字符串的长度
     * @param {string} _charStr 随机的字符串
     */
    static getRandomString(len: number, _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'): string {
      const min = 0
      const max = _charStr.length - 1
      let _str = ''
      // 不允许为0的情况
      if (len === 0)
        return ''

      // 循环生成字符串
      for (let i = 0, index; i < len; i++) {
        index = (function (randomIndexFunc, i) {
          return randomIndexFunc(min, max, i, randomIndexFunc)
        })((min: any, max: any, i: any, _self: any) => {
          let indexTemp = Math.floor(Math.random() * (max - min + 1) + min)
          const numStart = _charStr.length - 10
          if (i === 0 && indexTemp >= numStart)
            indexTemp = _self(min, max, i, _self)

          return indexTemp
        }, i)
        _str += _charStr[index]
      }
      return _str
    }

    /**
     * 日期转时间戳, 格式 1970/01/01 00:00:00 或 1970-01-01 00:00:00
     * @param {string} date 日期
     */
    static dateToTimestamp(date: string): number {
      return new Date(date.replace(/-/g, '/')).getTime()
    }

    /**
     * 时间戳转日期, 格式 1609459200。 支持获取特定时间
     * @param {number} data 时间戳。输出格式 1970/01/01 00:00:00
     * @param {string} data_type 【可选】获取时间类型 y、m、d、h、i、s。如 s = 获取时间戳中的秒
     */
    static timestampToDate(data: number, data_type: string = ''): string | number | undefined {
      let _data = 0
      if (String(data).length === 13)
        _data = data

      else
        _data = data * 1000

      const time = new Date(_data)
      let _time
      if (data_type === 'y')
        _time = time.getFullYear()

      if (data_type === 'm')
        _time = pad(time.getMonth() + 1, 2)

      if (data_type === 'd')
        _time = pad(time.getDate(), 2)

      if (data_type === 'h')
        _time = pad(time.getHours(), 2)

      if (data_type === 'i')
        _time = pad(time.getMinutes(), 2)

      if (data_type === 's')
        _time = pad(time.getSeconds(), 2)

      if (data_type === '')
        _time = `${time.getFullYear()}/${pad(time.getMonth() + 1, 2)}/${pad(time.getDate(), 2)} ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}`

      function pad(num: number, size: number): string {
        let s = `${num}`
        while (s.length < size) s = `0${s}`
        return s
      }
      return _time
    }

    /**
     * 判断常量变量类型
     * @param {any} constant 常量
     * @param {number} variable 变量
     * @param {number} index_type 选项类型 0 = 常量 1 = 变量
     * @param {number} variable_type 【默认数值】变量类型 0 = 数值, 1 = 字符串, 2 = 开关(返回 0 = 关闭, 1 = 开启)
     */
    static JudgeTypeConstantVariable(constant: any, variable: number, index_type: number, variable_type: number = 0): any {
      let variable_value
      if (index_type === 0) {
        variable_value = constant
      }
      else {
        // 数值
        if (variable_type === 0)
          variable_value = Game.player.variable.getVariable(variable)

        // 字符串
        if (variable_type === 1)
          variable_value = Game.player.variable.getString(variable)

        // 开关
        if (variable_type === 2)
          variable_value = Game.player.variable.getSwitch(variable)
      }
      return variable_value
    }

    /**
     * 光标系统样式名称
     * 'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'
     */
    static cursorSystemStyleName: string[] = [
      'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize',
    ]

    /**
     * 基于cursorSystemStyleName来弹出指定名称
     * @param {string[]} name 弹出指定的名称
     */
    static cursorSystemStyleName_spliceName(name: string[]): string[] {
      const cursorName = [...OpenAPI.Method.cursorSystemStyleName]
      return cursorName.filter(x => name.indexOf(x.toString()) === -1)
    }

    /**
     * 检查当前模板是否是兼容的模板ID。 false = 不兼容, true = 兼容
     * @param {number[]} templateID 兼容的模板ID合集
     */
    static checkTemplateID(templateID: number[]): boolean {
      return templateID.indexOf(Config.templateID) !== -1
    }

    /**
     * 随机颜色
     */
    static getRandomColor(): string {
      return `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`
    }

    /**
     * 更简单的HttpRequest
     * @param {string} url 请求地址
     * @param {any} json 数据
     * @param {any} completeText 完成事件
     * @param {any} errorText 发生错误时事件
     * @param {any} trigger 触发器
     * 
     * @deprecated 请使用 new HttpRequest()
     */
    static sendRequest(url: string, json: any, completeText: any, errorText: any, trigger: any = null, requestType = 'post'): void {
      const ur = new HttpRequest()
      ur.send(url, JSON.stringify(json), requestType, 'json', ['Content-Type', 'application/json'])
      if (trigger) {
        trigger.pause = true
        trigger.offset(1)
      }
      ur.once(EventObject.COMPLETE, this, (content: any) => {
        completeText(content)
        if (trigger)
          CommandPage.executeEvent(trigger)
      })
      ur.once(EventObject.ERROR, this, (content: any) => {
        errorText(content)
        if (trigger)
          CommandPage.executeEvent(trigger)
      })
    }

    /**
     * 解析文本内变量占位符
     * @param {string} text 文本
     * @param {[] | null} getData 返回函数
     * @param {RegExp[]} regex 正则表达式
     */
    static parseVarPlaceholderData(text: string, getData: (((s: any) => number) | ((s: any) => string))[] | null = null, regex: RegExp[] | null = null): string {
      if (getData == null) {
        getData = [
          (s: any) => { return Game.player.variable.getVariable(s) },
          (s: any) => { return Game.player.variable.getString(s) },
          (s: any) => { return Game.player.variable.getSwitch(s) },
          (s: any) => { return ClientWorld.variable.getVariable(s) },
          (s: any) => { return ClientWorld.variable.getString(s) },
          (s: any) => { return ClientWorld.variable.getSwitch(s) },
          (s: any) => { return Game.player.variable.getVariable(Game.player.variable.getVariable(s)) },
          (s: any) => { return Game.player.variable.getString(Game.player.variable.getVariable(s)) },
          (s: any) => { return Game.player.variable.getSwitch(Game.player.variable.getVariable(s)) },
          (s: any) => { return ClientWorld.variable.getVariable(ClientWorld.variable.getVariable(s)) },
          (s: any) => { return ClientWorld.variable.getString(ClientWorld.variable.getVariable(s)) },
          (s: any) => { return ClientWorld.variable.getSwitch(ClientWorld.variable.getVariable(s)) },
        ]
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


      for (let i = 0; i < getData.length; i++) {
        const start = i >= 6 ? 4 : 3
        const result = this.replacePlaceholderData(text, regex[i], getData[i], start)
        if (result)
          text = result
      }
      return text
    }

    /**
     * 解析文本内游戏变量占位符
     * @param {string} text 文本
     * @param {string} gameData 游戏变量数据
     * @param {RegExp[]} regex 正则表达式
     */
    static parseGameVarPlaceholderData(text: string, gameData: any[], regex: RegExp[] | null = null): string {
      const getData = [
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameNumber[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameString[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomCondition[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
      ];
      if (regex == null) {
        regex = [
          /\[@gv\w+\]/g,
          /\[@gs\w+\]/g,
          /\[@gb\w+\]/g,
        ];
      }

      for (let i = 0; i < getData.length; i++) {
        const result = this.replacePlaceholderData(text, regex[i], getData[i], 4)
        if (result)
          text = result
      }
      return text
    }

    /**
     * 替换占位符数据
     * @param {string} text 文本
     * @param {RegExp} regex 正则表达式
     * @param {any} getData 解析占位符数据
     * @param {number} start 起始位
     * @param {string} end 结束符号
     */
    static replacePlaceholderData(text: string, regex: RegExp, getData: any, start: number = 3, end: string = ']'): string | null {
      const matches = text.match(regex)
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          const d = matches[i]
          const s = Number(d.slice(start, d.indexOf(end)))
          if (s || s == 0) {
            const v = getData(s)
            text = text.replace(d, v)
          }
        }
        return text
      }
      else {
        return null
      }
    };

    /**
    * 解析文本内函数组合
    * @param {string} text 文本
    * @param {RegExp[]} regex 正则表达式
    */
    static parseCombinedFunctions(text: string, regex: RegExp[] | null = null): string {
      const getData = [
        (...args: number[]) => { return Math.max(...args) },
        (...args: number[]) => { return Math.min(...args) },
        (a: number, b: number) => {
          const [min, max] = a < b ? [a, b] : [b, a];
          return Math.random() * (max - min) + min;
        },
        (...args: number[]) => { return args.reduce((acc, val) => acc + val, 0) },
        (num: number) => { return Math.abs(num) },
        (num: number) => { return Math.sqrt(num) },
        (num: number) => { return Math.round(num) },
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

      for (let i = 0; i < getData.length; i++) {
        const result = this.replaceFunctionCombinations(text, regex[i], getData[i]);
        if (result)
          text = result;
      }
      return text;
    }

    /**
       * 替换函数组合数据
       * @param {string} text 文本
       * @param {RegExp} regex 正则表达式
       * @param {any} getData 解析函数组合数据
       */
    static replaceFunctionCombinations(text: string, regex: RegExp, getData: any): string | null {
      const matches = text.match(regex);
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          const d = matches[i];
          const argsString = d.slice(d.indexOf('(') + 1, d.indexOf(')'));
          const args = argsString.split(',').map(Number);
          if (args.every(arg => !isNaN(arg))) {
            const v = getData(...args);
            text = text.replace(d, v.toString());
          }
        }
        return text;
      } else {
        return null;
      }
    }

    /**
     * 解析并计算复杂表达式的函数
     * @param {string} expression - 要解析的表达式
     * @returns {any} 计算结果，如果表达式无效则返回 null
     * @returns {operators} 正则表达式
     */
    static evaluateComplexExpression(expression: string, operators: any[]): any {
      // 去除表达式中的空格
      expression = expression.replace(/\s+/g, '');

      /**
       * 递归解析函数
       * @param {string} expr - 要解析的子表达式
       * @returns {any} 子表达式的计算结果
       */
      function parseExpression(expr: string, operators: any[]): any {
        // 处理括号内的表达式
        while (expr.includes('(')) {
          expr = expr.replace(/\([^()]*\)/g, match => {
            return String(parseExpression(match.slice(1, -1), operators));
          });
        }

        // 逐个运算符处理表达式
        for (const { regex, func } of operators) {
          while (regex.test(expr)) {
            expr = expr.replace(regex, (match, p1, p2) => {
              const operand1 = isNaN(p1 as any) ? (p1 === 'true' ? true : p1 === 'false' ? false : p1) : parseFloat(p1);
              const operand2 = isNaN(p2 as any) ? (p2 === 'true' ? true : p2 === 'false' ? false : p2) : parseFloat(p2);
              return String(func(operand1, operand2));
            });
          }
        }

        // 处理逻辑非运算符
        if (expr.startsWith('!')) {
          const operand = expr.slice(1);
          return !parseExpression(operand, operators);
        }

        // 返回最终结果
        const result = isNaN(expr as any) ? (expr === 'true' ? true : expr === 'false' ? false : expr) : parseFloat(expr);
        return result;
      }

      // 解析并计算输入表达式
      return parseExpression(expression, operators);
    }

    /**
     * 将阿拉伯数字转换为罗马数字的函数
     * @param {number} num - 要转换的阿拉伯数字
     * @returns {string} 对应的罗马数字
     */
    static intToRoman(num: number): string {
      // 定义一个数组，包含罗马数字的数值部分
      const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      // 定义一个数组，包含与数值对应的罗马数字符号
      const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

      // 初始化空字符串，用于存储最终的罗马数字
      let roman = "";

      // 遍历数值数组
      for (let i = 0; i < val.length; i++) {
        // 当输入数字大于或等于当前数值时
        while (num >= val[i]) {
          // 将对应的罗马数字符号添加到结果字符串中
          roman += syms[i];
          // 从输入数字中减去当前数值
          num -= val[i];
        }
      }

      // 返回最终的罗马数字字符串
      return roman;
    }

    /**
     * 打乱数组
     * @param array - 需要打乱的数组。
     * @returns 返回一个新的打乱顺序的数组。
     */
    static shuffleArray<T>(array: T[]): T[] {
      // 复制输入数组，避免修改原数组
      const shuffledArray = array.slice();

      // 从数组末尾开始遍历到第二个元素
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        // 在 0 到 i 之间随机选择一个索引
        const j = Math.floor(Math.random() * (i + 1));

        // 交换元素 shuffledArray[i] 和 shuffledArray[j]
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      // 返回打乱顺序后的数组
      return shuffledArray;
    }

    /**
     * 获取事件页名称
     * @param eventPage 事件页
     * @returns 
     */
    static getFeDataMessage(eventPage: string): string | null {
      if (!eventPage) return null;
      var startIdx = eventPage.indexOf(String.fromCharCode(5));
      var feName = eventPage.slice(0, startIdx);
      return feName ? feName : null;
    }

    /**
     * 获得模块数据
     * @param id 模块id
     * @param comp 回调
     * @param length 类别长度 默认16
     */
    static getModuleData(id: number, comp: Callback, length = 16) {
      for (let i = 1; i <= length; i++) {
        for (let j = 1; j <= GameData.getLength(id, i); j++) {
          let d = GameData.getModuleData(id, (i - 1) * 1000 + j);
          if (d && d.name) {
            comp.runWith([d]);
          }
        }
      }
    }

    /**
     * 获取两个数之间的范围，包括起始和结束数字
     * @param start - 范围的起始数字
     * @param end - 范围的结束数字
     * @returns 包含从起始数字到结束数字之间所有数字的数组
     */
    static getRange(start: number, end: number): number[] | null {
      if (typeof start !== 'number' || typeof end !== 'number') {
        return null
      }
      const range: number[] = [];
      if (start <= end) {
        // 如果起始数字小于或等于结束数字，按升序添加数字
        for (let i = start; i <= end; i++) {
          range.push(i);
        }
      } else {
        // 如果起始数字大于结束数字，按降序添加数字
        for (let i = start; i >= end; i--) {
          range.push(i);
        }
      }
      return range;
    }
  }
}
module OpenAPI {
    /**
     * 模块工具
     */
    export class ModuleUtils {

        /**
         * 获得模块数据
         * 
         * @param {number} id - 模块ID
         * @param {Callback} comp 回调
         * @param {number} length 类别长度 默认16
         * 
         * @example
         * const moduleData = getModuleData(1, (data) => {
         *     console.log(data)
         * }) // 返回 '模块数据'
         */
        static getModuleData = (id: number, comp: Callback, length: number = 16): void => {
            return OpenAPI.Method.getModuleData(id, comp, length);
        }
    }
}module OpenAPI {
    /**
     * 对象操作工具
     */
    export class ObjectUtils {

        /**
         * 反转对象的键和值。输入对象的键变为输出对象的值，而输入对象的值变为输出对象的键。
         *
         * 此函数接受一个对象，并通过反转其键和值创建一个新对象。如果输入对象具有重复的值，
         * 则在输出对象中，最后出现的键将作为新键的值。它有效地创建了输入对象键值对的反向映射。
         *
         * @template K - 输入对象中键的类型（字符串，数字，符号）
         * @template V - 输入对象中值的类型（字符串，数字，符号）
         * @param {Record<K, V>} obj - 要反转键和值的输入对象
         * @returns {{ [key in V]: K }} - 键和值被反转的新对象
         *
         * @example
         * invert({ a: 1, b: 2, c: 3 }); // { 1: 'a', 2: 'b', 3: 'c' }
         * invert({ 1: 'a', 2: 'b', 3: 'c' }); // { a: '1', b: '2', c: '3' }
         * invert({ a: 1, 2: 'b', c: 3, 4: 'd' }); // { 1: 'a', b: '2', 3: 'c', d: '4' }
         * invert({ a: Symbol('sym1'), b: Symbol('sym2') }); // { [Symbol('sym1')]: 'a', [Symbol('sym2')]: 'b' }
         */
        static invert<K extends PropertyKey, V extends PropertyKey>(obj: Record<K, V>): { [key in V]: K } {
            const result = {} as { [key in V]: K };

            for (const key in obj) {
                const value = obj[key as K] as V;
                result[value] = key;
            }

            return result;
        }

        /**
         * 创建一个省略指定键的新对象。
         *
         * 此函数接受一个对象和一个键数组，并返回一个新对象，该对象排除了与指定键对应的属性。
         *
         * @template T - 对象的类型。
         * @template K - 对象中的键的类型。
         * @param {T} obj - 要从中省略键的对象。
         * @param {K[]} keys - 要从对象中省略的键数组。
         * @returns {Omit<T, K>} - 省略了指定键的新对象。
         *
         * @example
         * const obj = { a: 1, b: 2, c: 3 };
         * const result = omit(obj, ['b', 'c']);
         * // result 将为 { a: 1 }
         */
        static omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
            const result = { ...obj };

            for (const key of keys) {
                delete result[key];
            }

            return result as Omit<T, K>;
        }

        /**
         * 创建一个由不满足条件函数的属性组成的新对象。
         *
         * 此函数接受一个对象和一个条件函数，并返回一个新对象，该对象只包含条件函数返回 `false` 的属性。
         *
         * @template T - 对象的类型。
         * @param {T} obj - 要从中省略属性的对象。
         * @param {(value: T[string], key: keyof T) => boolean} shouldOmit - 一个条件函数，用于确定是否应省略属性。
         * 它以属性的键和值作为参数，并返回 `true` 表示应省略该属性，返回 `false` 表示不应省略该属性。
         * @returns {Partial<T>} - 包含不满足条件函数的属性的新对象。
         *
         * @example
         * const obj = { a: 1, b: 'omit', c: 3 };
         * const shouldOmit = (key, value) => typeof value === 'string';
         * const result = omitBy(obj, shouldOmit);
         * // result 将为 { a: 1, c: 3 }
         */
        static omitBy<T extends Record<string, any>>(
            obj: T,
            shouldOmit: (value: T[keyof T], key: keyof T) => boolean
        ): Partial<T> {
            const result: Partial<T> = {};

            for (const [key, value] of Object.entries(obj)) {
                if (shouldOmit(value, key)) {
                    continue;
                }

                (result as any)[key] = value;
            }

            return result;
        }

        /**
         * 创建一个由选定对象属性组成的新对象。
         *
         * 此函数接受一个对象和一个键数组，并返回一个新对象，该对象只包含与指定键对应的属性。
         *
         * @template T - 对象的类型。
         * @template K - 对象中的键的类型。
         * @param {T} obj - 要从中选择键的对象。
         * @param {K[]} keys - 要从对象中选择的键数组。
         * @returns {Pick<T, K>} - 包含选定键的新对象。
         *
         * @example
         * const obj = { a: 1, b: 2, c: 3 };
         * const result = pick(obj, ['a', 'c']);
         * // result 将为 { a: 1, c: 3 }
         */
        static pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
            const result = {} as Pick<T, K>;

            for (const key of keys) {
                result[key] = obj[key];
            }

            return result;
        }

        /**
         * 创建一个由满足谓词函数的属性组成的新对象。
         *
         * 此函数接受一个对象和一个谓词函数，并返回一个新对象，该对象只包含谓词函数返回 true 的属性。
         *
         * @template T - 对象的类型。
         * @param {T} obj - 要从中选择属性的对象。
         * @param {(value: T[keyof T], key: keyof T) => boolean} shouldPick - 确定是否应选择属性的谓词函数。
         * 它以属性的键和值作为参数，并返回 `true` 如果应选择该属性，否则返回 `false`。
         * @returns {Partial<T>} - 包含满足谓词函数的属性的新对象。
         *
         * @example
         * const obj = { a: 1, b: 'pick', c: 3 };
         * const shouldPick = (value) => typeof value === 'string';
         * const result = pickBy(obj, shouldPick);
         * // result 将为 { b: 'pick' }
         */
        static pickBy<T extends Record<string, any>>(
            obj: T,
            shouldPick: (value: T[keyof T], key: keyof T) => boolean
        ): Partial<T> {
            const result: Partial<T> = {};

            for (const [key, value] of Object.entries(obj)) {
                if (!shouldPick(value, key)) {
                    continue;
                }

                (result as any)[key] = value;
            }

            return result;
        }
    }
}module OpenAPI {

    /**
     * 操作系统工具
     */
    export class OsUtils {

        /**
         * 获取当前操作系统的用户名称
         */
        static get systemUserName(): string {
            const userInfo = OpenAPI.RunUtils.os.userInfo();
            if (userInfo == null) {
                return "";
            }
            if (userInfo.username == null) {
                return "";
            }

            try {
                let fullName = "";
                let buffer = OpenAPI.RunUtils.child_process.execSync(`wmic useraccount where name="${userInfo.username}" get fullname`, { encoding: 'buffer' });
                const langInfo = window.navigator.language;
                let decoder;
                if (langInfo == "zh-CN") {
                    decoder = new TextDecoder('gbk');
                }
                else {
                    decoder = new TextDecoder();
                }
                let info: string = decoder.decode(buffer);
                let fullNameInfo = info.split("\n")[1];
                fullName = fullNameInfo.trim();
                if (fullName == "") {
                    //如果是空的时候就用用户名
                    fullName = userInfo.username;
                }
                return fullName;
            }
            catch (e) {
                console.error(e);
                return userInfo.username;
            }
        }
    }
}module OpenAPI {
    /**
     * 路径工具
     */
    export class PathUtils {
        
        /**
         * 获取当前游戏根路径
         * 
         * @example
         * const gamePath = OpenAPI.RunUtils.gamePath // 返回当前游戏根路径
         */
        static get gamePath(): string | undefined {
            let path = '';
            if (!Config.RELEASE_GAME) {
                const random = OpenAPI.MathUtils.randomInt(1000, 100000);
                const tempIdentifier = `OpenAPITempGamePathIdentifier${random}`;
                //@ts-ignore
                path = decodeURIComponent(Laya.URL.formatURL(tempIdentifier)).replace(`/${tempIdentifier}`, '');
            }
            else {
                //@ts-ignore
                path = FileUtils.nativePath;
            }
            return path;
        }
    }
}module OpenAPI{
  /**
   * 点
   */
  export class Point {
    /**
     * 数值坐标数组转对象坐标数组
     */
    static toCoordinateObjects(arr: number[]): { x: number; y: number }[] {
      const result: { x: number; y: number }[] = []
      for (let i = 0; i < arr.length; i += 2)
        result.push({ x: arr[i], y: arr[i + 1] })

      return result
    }

    /**
     * 相对于父级容器的坐标
     */
    static relativeToParent(objectsArray: { x: number; y: number }[], parent: { x: number; y: number }) {
      return objectsArray.map(point => ({
        x: point.x + parent.x,
        y: point.y + parent.y,
      }))
    }
  }
}
module OpenAPI {
    /**
     * 谓词操作工具
     */
    export class PredicateUtils {

        /**
         * 检查给定值是否为 null 或 undefined。
         *
         * 此函数测试提供的值是否为 `null` 或 `undefined`。
         * 如果值为 `null` 或 `undefined`，则返回 `true`，否则返回 `false`。
         *
         * 在 TypeScript 中，此函数还可以作为类型谓词，将参数的类型缩小为 `null` 或 `undefined`。
         *
         * @param {unknown} x - 要测试是否为 null 或 undefined 的值。
         * @returns {boolean} - 如果值为 null 或 undefined，则返回 `true`，否则返回 `false`。
         *
         * @example
         * const value1 = null;
         * const value2 = undefined;
         * const value3 = 42;
         * const result1 = isNil(value1); // true
         * const result2 = isNil(value2); // true
         * const result3 = isNil(value3); // false
         */
        static isNil(x: unknown): x is null | undefined {
            return x === null || x === undefined;
        }

        /**
         * 检查给定值是否既不是 null 也不是 undefined。
         *
         * 此函数的主要用途是在 TypeScript 中作为类型谓词使用。
         *
         * @template T - 值的类型。
         * @param {T | null | undefined} x - 要测试是否不为 null 也不为 undefined 的值。
         * @returns {x is T} - 如果值不是 null 也不是 undefined，则返回 true；否则返回 false。
         *
         * @example
         * // 这里 `arr` 的类型是 (number | undefined)[]
         * const arr = [1, undefined, 3];
         * // 这里 `result` 的类型是 number[]
         * const result = arr.filter(isNotNil);
         * // result 将为 [1, 3]
         */
        static isNotNil<T>(x: T | null | undefined): x is T {
            return x !== null && x !== undefined;
        }

        /**
         * 检查给定值是否为 null。
         *
         * 此函数测试提供的值是否严格等于 `null`。
         * 如果值为 `null`，则返回 `true`；否则返回 `false`。
         *
         * 此函数还可以作为 TypeScript 中的类型谓词使用，将参数的类型缩小为 `null`。
         *
         * @param {unknown} x - 要测试是否为 null 的值。
         * @returns {x is null} - 如果值为 null，则返回 true；否则返回 false。
         *
         * @example
         * const value1 = null;
         * const value2 = undefined;
         * const value3 = 42;
         *
         * console.log(isNull(value1)); // true
         * console.log(isNull(value2)); // false
         * console.log(isNull(value3)); // false
         */
        static isNull(x: unknown): x is null {
            return x === null;
        }

        /**
         * 检查给定值是否为 undefined。
         *
         * 此函数测试提供的值是否严格等于 `undefined`。
         * 如果值为 `undefined`，则返回 `true`；否则返回 `false`。
         *
         * 此函数还可以作为 TypeScript 中的类型谓词使用，将参数的类型缩小为 `undefined`。
         *
         * @param {unknown} x - 要测试是否为 undefined 的值。
         * @returns {x is undefined} - 如果值为 undefined，则返回 true；否则返回 false。
         *
         * @example
         * const value1 = undefined;
         * const value2 = null;
         * const value3 = 42;
         *
         * console.log(isUndefined(value1)); // true
         * console.log(isUndefined(value2)); // false
         * console.log(isUndefined(value3)); // false
         */
        static isUndefined(x: unknown): x is undefined {
            return x === undefined;
        }
    }
}
module OpenAPI {
    /**
     * Promise 操作工具
     */
    export class PromiseUtils {

        /**
         * 延迟执行指定毫秒数的代码。
         *
         * 此函数返回一个 Promise，在指定的延迟后解析，允许您与 async/await 结合使用以暂停执行。
         *
         * @param {number} ms - 要延迟的毫秒数。
         * @param {DelayOptions} options - 选项对象。
         * @param {AbortSignal} options.signal - 可选的 AbortSignal，用于取消延迟。
         * @returns {Promise<void>} 在指定延迟后解析的 Promise。
         *
         * @example
         * async function foo() {
         *   console.log('开始');
         *   await delay(1000); // 延迟执行1秒钟
         *   console.log('结束');
         * }
         *
         * foo();
         *
         * // 使用 AbortSignal
         * const controller = new AbortController();
         * const { signal } = controller;
         *
         * setTimeout(() => controller.abort(), 50); // 50毫秒后取消延迟
         * try {
         *   await delay(100, { signal });
         * } catch (error) {
         *   console.error(error); // 将会记录 'AbortError'
         * }
         * }
         */
        static delay(ms: number, { signal }: { signal?: AbortSignal } = {}): Promise<void> {
            return new Promise((resolve, reject) => {
                const abortError = () => {
                    reject(new OpenAPI.AbortError());
                };

                const abortHandler = () => {
                    clearTimeout(timeoutId);
                    abortError();
                };

                if (signal?.aborted) {
                    return abortError();
                }

                const timeoutId = setTimeout(resolve, ms);

                signal?.addEventListener('abort', abortHandler, { once: true });
            });
        }

    }
}module OpenAPI{
  /**
   * 第三方库
   */
  export class Require {
    /**
     * 库初始化
     */
    static Init(name: string, filename?: string) {
      filename = filename ? `${name}/${filename}` : `${name}/${name}`
      // @ts-expect-error 忽略处理
      const path = os.inGC() ? `${decodeURIComponent(Laya.URL.formatURL('asset'))}/myally_modules/${filename}` : `${FileUtils.nativePath}/asset/myally_modules/${filename}`
      // @ts-expect-error 忽略处理
      const topRequire = typeof require != 'undefined' ? require : top.top.require
      return topRequire(path)
    }
  }
}
module OpenAPI {

    /**
     * 运行时工具
     */
    export class RunUtils {

        /**
         * 获取默认引入的库
         * 
         * @param {string} name - 库名
         * 
         * @example
         * const fs = OpenAPI.RunUtils.require('fs') // 返回引入的库
         */
        static require(name: string): any | undefined {
            // @ts-ignore
            return mainDomain_require(name);
        }

        /**
         * fs库
         * 
         * @example
         * const fs = OpenAPI.RunUtils.fs // 返回引入的fs库
         */
        static get fs(): any | undefined {
            return OpenAPI.RunUtils.require('fs');
        }

        /**
         * path库
         * 
         * @example
         * const path = OpenAPI.RunUtils.path // 返回引入的path库
         */
        static get path(): any | undefined {
            return OpenAPI.RunUtils.require('path');
        }

        /**
         * os库
         * 
         * @example
         * const os = OpenAPI.RunUtils.os // 返回引入的os库
         */
        static get os(): any | undefined {
            return OpenAPI.RunUtils.require('os');
        }

        /**
         * process库
         */
        static get process(): any | undefined {
            return OpenAPI.RunUtils.require('process');
        }

        /**
         * child_process库
         * 
         * @example
         * const child_process = OpenAPI.RunUtils.child_process // 返回引入的child_process库
         */
        static get child_process(): any | undefined {
            return OpenAPI.RunUtils.require('child_process');
        }

        /**
         * nw.gui库
         * 
         * @example
         * const nw_gui = OpenAPI.RunUtils.nw_gui // 返回引入的nw.gui库
         */
        static get nw_gui(): any | undefined {
            return OpenAPI.RunUtils.require('nw.gui');
        }
    }
}
module OpenAPI {
    /**
     * 字符串操作工具
     */
    export class StringUtils {

        /**
         * 将字符串转换为蛇形命名法（snake_case）。
         *
         * 蛇形命名法是一种命名约定，其中每个单词都以小写字母书写，并用下划线（_）字符分隔。
         *
         * @param {string} str - 要转换为蛇形命名法的字符串。
         * @returns {string} - 转换后的蛇形命名法字符串。
         *
         * @example
         * const convertedStr1 = snakeCase('camelCase') // 返回 'camel_case'
         * const convertedStr2 = snakeCase('some whitespace') // 返回 'some_whitespace'
         * const convertedStr3 = snakeCase('hyphen-text') // 返回 'hyphen_text'
         * const convertedStr4 = snakeCase('HTTPRequest') // 返回 'http_request'
         */
        static snakeCase = (str: string): string => {
            const splitWords = str.match(OpenAPI.ConstantsUtils.CASE_SPLIT_PATTERN) || [];
            return splitWords.map(word => word.toLowerCase()).join('_');
        };

        /**
         * 随机字符串
         * 
         * @param {number} length - 字符串长度
         * @param {string} str - 随机的字符串
         * 
         * @example
         * const randomStr = randomString(10) // 返回 'a1b2c3d4e5'
         */
        static randomString = (length: number, str: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'): string => {
            return OpenAPI.Method.getRandomString(length, str);
        }

        /**
         * 随机颜色
         * 
         * @example
         * const randomColor = randomColor() // 返回 '#ffffff'
         */
        static get randomColor(): string {
            return OpenAPI.Method.getRandomColor();
        }

        /**
         * 解析文本内变量占位符数据, 可自定义获取数据的方法以及正则表达式
         * 
         * @param {string} text - 文本
         * @param {(((s: any) => number) | ((s: any) => string))[]} getData - 获取数据的方法
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * const text = '你好, 我是[@s1], 今年[@v1]岁'
         * return parseVariableText(text) // 返回 '你好, 我是黑白, 今年18岁'
         */
        static parseVariableText = (text: string, getData: (((s: any) => number) | ((s: any) => string))[] | null = null, regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseVarPlaceholderData(text, getData, regex);
        }

        /**
         * 解析文本内游戏变量占位符数据
         * 
         * @param {string} text - 文本
         * @param {any[]} gameData - 游戏数据
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * const text = '你好, 我是[@gs0], 今年[@gv1]岁'
         * // gameData 需要从编辑器中获取, 例如游戏变量组件
         * return parseGameVariableText(text, gameData) // 返回 '你好, 我是黑白, 今年18岁'
         */
        static parseGameVariableText = (text: string, gameData: any[], regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseGameVarPlaceholderData(text, gameData, regex);
        }

        /**
         * 解析文本内函数组合占位符数据
         * 
         * @param {string} text - 文本
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * const text = 'max(1,100)' // 获取最大值
         * return parseFunctionText(text) // 返回 '100'
         * const text = 'min(1,100)' // 获取最小值
         * return parseFunctionText(text) // 返回 '1'
         * const text = 'random(1,100)' // 获取随机数
         * return parseFunctionText(text) // 返回 '18.1234...' 不会取整
         * const text = 'reduce(50,100)' // 获取平均值
         * return parseFunctionText(text) // 返回 '150'
         * const text = 'abs(-18)' // 获取绝对值
         * return parseFunctionText(text) // 返回 '18'
         * const text = 'sqrt(18)' // 获取开方
         * return parseFunctionText(text) // 返回 '4.2426...' 不会取整
         * const text = 'round(1.1234)' // 获取整数
         * return parseFunctionText(text) // 返回 '1'
         */
        static parseFunctionText = (text: string, regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseCombinedFunctions(text, regex);
        }

        /**
         * 将阿拉伯数字转换为罗马数字的函数
         * 
         * @param {number} num - 阿拉伯数字
         * 
         * @example
         * const romanNum = arabicToRoman(2024) // 返回 'MMXXIV'
         */
        static arabicToRoman = (num: number): string => {
            return OpenAPI.Method.intToRoman(num);
        }
    }
}/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 3.6
 */
module OpenAPI {

  /**
   * 插件的系统API
   */
  export class System {
    /**
     * 当前版本号
     */
    static Version = 3.6

    /**
     * 是否安装本插件
     */
    static Installed = true
  }

  // 输出
  setTimeout(() => {
    if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
      if (!Config.RELEASE_GAME)
        trace(`OpenAPI v${OpenAPI.System.Version.toFixed(1)} => OK`)

      else
        console.log(` %c OpenAPI v${OpenAPI.System.Version.toFixed(1)} %c https://www.gamecreator.com.cn/plug/det/641 `, 'color: #fadfa3; background: #333; padding:8px;border-left:1px solid #fadfa3;border-top:1px solid #fadfa3;border-bottom:1px solid #fadfa3;', 'color: #fadfa3; background: #333; padding:8px; border:1px solid #fadfa3;')
    }
  }, 1000)
};

/**
 * OpenAPI 部分函数来自 es-toolkit
 * @see https://github.com/toss/es-toolkit
 * @version 1.9.0
 *
  MIT License

  Copyright (c) 2024 Viva Republica, Inc

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */

module OpenAPI {

  /**
   * 界面模块API
   */
  export class UI {
    /**
     * 界面列表组件数据初始化
     * @param {UIList} list 指定列表
     * @param {any} List_modelGUI 项模型数据,如：ListItem_1
     * @param {number} list_len 列表长度
     * @param {boolean} isFocus 【默认关闭】是否设置焦点
     */
    static listDataInit(list: UIList, List_modelGUI: any, list_len: number, isFocus = false): void {
      const arr = []
      for (let i = 1; i <= list_len; i++)
        arr.push(new List_modelGUI())

      list.items = arr
      if (isFocus)
        UIList.focus = list
    }
  }
  /**
   * Created by 千叶不冷 on 2021-09-24 15:26:19.
   * 通用悬浮框(提示框)
   */
  export class ShowTips {
    /**
     * 当前提示框界面id
     */
    static tipUIId: number

    /**
     * 即将显示的界面id
     */
    static onTipId: number

    /**
     * 当前提示框ui
     */
    static tipUI: UIBase | any

    /**
     * 构造函数
     */
    constructor() { }

    /**
     * 显示提示框
     * @param tipData 数据
     * @param id 提示框界面id
     */
    static showTips(tipData: any, id: number) {
      this.tipUIId = id
      if (!this.tipUI || this.tipUI.id !== String(id)) {
        this.tipUI = GameUI.show(id)
        this.tipUI.x = stage.mouseX + 15
        this.tipUI.y = stage.mouseY + 15
        const maxWidth = Config.WINDOW_WIDTH - 5
        const maxHeight = Config.WINDOW_HEIGHT - 15
        if (this.tipUI.tipRoot) {
          if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
            this.tipUI.x = maxWidth - this.tipUI.tipRoot.width
          if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
            this.tipUI.y = maxHeight - this.tipUI.tipRoot.height
        }
        this.tipUI.mouseEnabled = false
        for (const data in tipData) {
          if (this.tipUI[data] && tipData[data]) {
            for (const d in tipData[data])
              this.tipUI[data][d] = tipData[data][d]
          }
        }
      }
      else {
        this.tipUI.x = stage.mouseX + 15
        this.tipUI.y = stage.mouseY + 15
        const maxWidth = Config.WINDOW_WIDTH - 5
        const maxHeight = Config.WINDOW_HEIGHT - 15
        if (this.tipUI.tipRoot) {
          if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
            this.tipUI.x = maxWidth - this.tipUI.tipRoot.width
          if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
            this.tipUI.y = maxHeight - this.tipUI.tipRoot.height
        }
      }
    }

    /**
     * 关闭所有提示
     */
    static colseTip() {
      if (this.tipUIId)
        GameUI.hide(this.tipUIId)
      this.tipUIId = 0
    }

    /**
     * 显示提示
     */
    static showTip: any

    /**
     * 移动提示
     */
    static moveTip: any

    /**
     * 初始化完成
     */
    static isInit: boolean = false

    /**
     * 初始化
     */
    static init(id: number) {
      if (this.isInit)
        return
      this.isInit = true
      GameUI.load(id)
      // 当鼠标右键时消除提示
      stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.colseTip)
    }

    /**
     * 注册鼠标悬浮弹出提示框界面事件
     * @param ui 需要注册的界面ui
     * @param tipId 需要显示的界面id
     * @param tipData 数据 如{"name":{text:"千叶不冷","age":{text:"18"}} 当显示提示框时会自动匹配到提示框界面中相同名字的组件并赋值
     * @param delayed [可选 默认为0] 延迟显示
     * @param expandList [可选 默认为false] 展开列表，当ui为列表时会对里面每个item赋予data.tip的值，即tipData = data.tip
     */
    static addTipEvent(ui: UIBase, tipId: number, tipData: any, delayed: number = 0, expandList: boolean = false) {
      this.init(tipId)
      const onItemCreate = (_ui: UIRoot, data: UIListItemData | any, index: number) => {
        this.addTipEvent(_ui, tipId, data['tip'], delayed, false)
      }
      const addTip = () => {
        ui.off(EventObject.MOUSE_MOVE, this, this.showTip)
        ui.off(EventObject.MOUSE_OUT, this, this.colseTip)
        ui.off(EventObject.MOUSE_MOVE, this, this.moveTip)
        this.showTip = () => {
          if (this.tipUIId) {
            GameUI.hide(this.tipUIId)
            this.tipUIId = 0
          }
          this.onTipId = tipId
          setTimeout(() => {
            if (this.onTipId === tipId)
              this.showTips(tipData, tipId)
          }, delayed)
        }
        this.moveTip = () => {
          if (this.tipUIId === tipId)
            this.showTips(tipData, tipId)
        }
        // 当鼠标移入时显示
        ui.on(EventObject.MOUSE_OVER, this, this.showTip)
        ui.on(EventObject.MOUSE_MOVE, this, this.moveTip)
        // 当鼠标移出时消失
        ui.on(EventObject.MOUSE_OUT, this, this.colseTip)
      }
      // 判断是否展开列表
      if (ui instanceof UIList && expandList)
        ui.on(UIList.ITEM_CREATE, this, onItemCreate)

      else addTip()
    }
  }
}

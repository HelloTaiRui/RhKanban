import { format } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

export class MockHelper {

    private static _id: number = 0;

    static guid(bit = 16): string {
        const target = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line: no-bitwise
            const rand = (Math.random() * bit) | 0;
            // tslint:disable-next-line: no-bitwise
            const v = c === 'x' ? rand : (rand & 0x3) | 0x8;
            return v.toString(bit);
        });
        return target;
    }

    static createId() {
        this._id += 1;
        return this._id;
    }

    /**
     * 创建一个不断定时生成目标数据的可观察对象并在订阅后立即生成第一次的数据。
     * @param fn 参数为数量，返回为目标数据的生成函数
     * @param num 每次要生成的数量
     * @param genInterval 生成间隔。默认5秒
     */
    static create<T>(fn: (num: number) => T[], num: number, genInterval: number = 5000) {
        return timer(0, genInterval).pipe(map(() => fn(num)));
    };

    /**
     * 指定当天，生成一串按formatter格式化、以today为最后一天、向前推算且包含today的共连续的num天的日期串数组。
     * @param num 数量
     * @param today 最后一天。
     * @param formatter 格式化
     * @returns 
     */
    static generateDays(num: number, today: number = new Date().getTime(), formatter: string | ((date: Date) => any) = date => `${date.getMonth() + 1}-${date.getDate()}`) {
        let result = [];
        if (typeof formatter == "string") {
            let _format = formatter;
            formatter = (date) => format(date, _format);
        }
        for (let i = num - 1; i >= 0; i--) {
            let tmp = new Date(today - i * 24 * 3600 * 1000);
            result.push(formatter(tmp));
        }
        return result;
    }

    /**
     * 指定当天，生成一串按formatter格式化、以today为最后一天、向前推算且包含today的共连续的num间隔的日期串数组。
     * @param num 数量
     * @param today 最后一天。
     * @param formatter 格式化
     * @returns 
     */
    static generateTimes(num: number, interval: number = 24 * 3600 * 1000, today: number = new Date().getTime(), formatter: string | ((date: Date) => any) = date => `${date.getMonth() + 1}-${date.getDate()}`) {
        let result = [];
        if (typeof formatter == "string") {
            let _format = formatter;
            formatter = (date) => format(date, _format);
        }
        for (let i = num - 1; i >= 0; i--) {
            let tmp = new Date(today - i * interval);
            result.push(formatter(tmp));
        }
        return result;
    }

    /**
     * 生成一串整数，每个均大于等于min且小于max
     * @param num 
     * @param min 
     * @param max 
     * @returns 
     */
    static generateIntegerData(num: number, min: number, max: number) {
        let result = [];
        for (let i = num - 1; i >= 0; i--) {
            let tmp = Math.random() * (max - min) + min;
            result.push(parseInt(tmp as any));
        }
        return result;
    }

    /**
     * 生成>=min且<=max的一个整数
     * @param min 最小值
     * @param max 最大值
     * @returns 
     */
    static genIntBetween(min: number, max: number) {
        return Math.round(Math.random() * (max - min) + min);
    }

    /**
     * 按gen方法生成一个数组
     * @param gen 生成方法
     * @param num 个数
     * @returns 
     */
    static genArr(num: number, gen: (i?: number) => any = (i) => i) {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push(gen(i));
        }
        return arr;
    }

}
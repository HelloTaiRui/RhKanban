import { RhSafeAny } from '@model';

/** 通用看板数据结构 */
export class RhBoardData {
  constructor(
    /** 项目名称 */
    public item: string,
    /** 项目值 */
    public value1: RhSafeAny,
    /** 子项目 */
    public children?: RhBoardData[],
    /** 项目值2（备用） */
    public value2?: RhSafeAny,
    /** 项目值3（备用） */
    public value3?: RhSafeAny
  ) {}
}

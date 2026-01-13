import { RhSafeAny } from "@model/base";


export class RhRankTableColumn {
  constructor(
    public key: string,
    public name: string,
    public width?: string,
    public custom?: boolean,
    public templateKey?: string,
    public color?: string,
    public bgColor?: string
  ) {}
}

export class RhRankTable {
  constructor(
    public columns: RhRankTableColumn[] = [],
    public data: RhSafeAny[] = [],
    public showHeader: boolean = true,
    public showRank: boolean = true,
    public pageSize: number = 3,
    public visibleRate: number = 1.5,
    public moveSpeed: number = 3000,
    public enableDisplay: boolean = false
  ) {}

  static create(obj: Partial<RhRankTable>) {
    return Object.assign(new RhRankTable(), obj);
  }
}

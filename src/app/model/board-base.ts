import { Subscription } from 'rxjs';

export class RhBoardBase {
  protected defaultNumberUnifyPrecision: number = 2;

  protected subscriptions: Subscription[] = [];

  /** 启用模拟数据 */
  public enableMock = false;

  init() {}

  addSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  clearSubscriptions() {
    this.subscriptions.forEach((item) => item.unsubscribe());
    this.subscriptions = [];
  }

  trackByIndex(i: number, d: any) {
    return i;
  }

  /** 设置小数位数。默认最大保留两位。比如，25.233=>25.23，16.8=>16.8 */
  unifyNumber(
    num: number | string,
    precision: number = this.defaultNumberUnifyPrecision
  ) {
    if (num === '') {
      return 0;
    } else {
      let handleNum = parseFloat(num as any);
      let isToFixed =
        handleNum.toString().includes('.') &&
        handleNum.toString().split('.')[1].length > precision;
      if (isToFixed) {
        return (handleNum.toFixed(precision) as any) * 1;
      } else {
        return handleNum;
      }
    }
  }
  /** 转换整数至指定位数的字符串。用于数值展示 */
  convertNumber(N: number, M: number, unit: string, toArray = true) {
    // 参数验证
    if (!Number.isInteger(N) || N < 0) {
      throw new Error('N必须是非负整数');
    }
    if (!Number.isInteger(M) || M < 4 || M > 8) {
      throw new Error('M必须是4到8之间的整数');
    }

    const numStr = N.toString();
    const numLength = numStr.length;
    let result = '';
    let segmentCount = 0;

    // 情况1：数字位数小于等于M，左侧补零
    if (numLength <= M) {
      result = numStr.padStart(M, '0');
    }
    // 情况2：数字位数大于M，需要进行分段处理
    else {
      let tmp = N;
      while (Math.floor(tmp / 10000) > 0) {
        tmp = Math.floor(tmp / 10000);
        segmentCount += 1;
      }
      result = (N / Math.pow(10000, segmentCount)).toString().slice(0, M);
    }

    return {
      result: toArray ? result.split('') : result,
      segments: segmentCount,
      unit: (() => {
        const map = [
          '',
          '万',
          '亿',
          '兆',
          '京',
          '垓',
          '秭',
          '穰',
          '沟',
          '涧',
          '正',
          '载',
          '极',
        ];
        return map[segmentCount] + unit;
      })(),
    };
  }
}
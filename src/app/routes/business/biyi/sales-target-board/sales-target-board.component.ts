import { Component, ViewEncapsulation } from '@angular/core';
import { RhvBoardBase } from '@shared';
import { RhSafeAny, RhvDisplayInstance } from '@model';

/** 销售目标看板数据接口 */
interface SalesTargetData {
  yearTarget: number;
  yearActual: number;
  yearRate: number;
  yearRemaining: number;
  quarterTarget: number;
  quarterActual: number;
  quarterRate: number;
  monthTarget: number;
  monthActual: number;
  monthRate: number;
  dayTarget: number;
  dayActual: number;
  dayRate: number;
  monthlyTrend: MonthlySalesItem[];
  dailyList: DailySalesItem[];
  updateTime: string;
}

interface MonthlySalesItem {
  month: number;
  actual: number;
  target: number;
}

interface DailySalesItem {
  date: string;
  target: number;
  actual: number;
  rate: number;
}

@Component({
  selector: 'rh-sales-target-board',
  templateUrl: './sales-target-board.component.html',
  styleUrls: ['./sales-target-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SalesTargetBoardComponent extends RhvBoardBase {
  public enableMock: boolean = true;

  /** 格式化金额 */
  formatMoney(value: number): string {
    if (value >= 10000) {
      return (value / 10000).toFixed(0) + '万';
    }
    return value.toLocaleString();
  }

  /** 格式化大额金额（带¥符号） */
  formatLargeMoney(value: number): string {
    if (value >= 100000000) {
      return '¥ ' + (value / 100000000).toFixed(2) + '亿';
    } else if (value >= 10000) {
      return '¥ ' + (value / 10000).toFixed(0) + '万';
    }
    return '¥ ' + value.toLocaleString();
  }

  /** 获取达成率状态类名 */
  getRateClass(rate: number): string {
    if (rate >= 100) return 'rate-success';
    if (rate >= 80) return 'rate-warning';
    return 'rate-danger';
  }

  /** 获取进度条颜色 */
  getProgressColor(rate: number): string {
    if (rate >= 100) return '#20E6A4';
    if (rate >= 80) return '#FFD15C';
    return '#FF6B6B';
  }

  /** 获取进度条宽度（限制最大100%） */
  getProgressWidth(rate: number): string {
    return Math.min(rate, 100) + '%';
  }

  /** 销售目标看板数据 */
  salesData = new RhvDisplayInstance<SalesTargetData, SalesTargetData, SalesTargetData>(
    this,
    null,
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'GetSalesTargetDashboard',
        {},
        'assets/mock/biyi/SalesTarget/SalesTargetDashboard.json',
        this.enableMock
      ),
      interval: 60000,
      emptyData: () => ({
        yearTarget: 0,
        yearActual: 0,
        yearRate: 0,
        yearRemaining: 0,
        quarterTarget: 0,
        quarterActual: 0,
        quarterRate: 0,
        monthTarget: 0,
        monthActual: 0,
        monthRate: 0,
        dayTarget: 0,
        dayActual: 0,
        dayRate: 0,
        monthlyTrend: [],
        dailyList: [],
        updateTime: '',
      }),
      convertor: (data: RhSafeAny) => {
        return data as SalesTargetData;
      },
    }
  );

  /** 月度趋势图表配置 */
  get monthlyChartOption(): RhSafeAny {
    const data = this.salesData.data;
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const actualData = data?.monthlyTrend?.map((item: MonthlySalesItem) => item.actual / 10000) || [];
    const targetData = data?.monthlyTrend?.map((item: MonthlySalesItem) => item.target / 10000) || [];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: RhSafeAny[]) => {
          let result = params[0].name + '<br/>';
          params.forEach((item: RhSafeAny) => {
            result += `${item.marker} ${item.seriesName}: ¥${item.value}万<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ['实际销售额', '目标'],
        textStyle: {
          color: '#A0AEC0',
        },
        top: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: {
          lineStyle: {
            color: '#4A5568',
          },
        },
        axisLabel: {
          color: '#A0AEC0',
        },
      },
      yAxis: {
        type: 'value',
        name: '金额(万)',
        nameTextStyle: {
          color: '#A0AEC0',
        },
        axisLine: {
          lineStyle: {
            color: '#4A5568',
          },
        },
        axisLabel: {
          color: '#A0AEC0',
        },
        splitLine: {
          lineStyle: {
            color: '#2D3748',
          },
        },
      },
      series: [
        {
          name: '实际销售额',
          type: 'bar',
          data: actualData,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#0783FA' },
                { offset: 1, color: '#07D1FA' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: '目标',
          type: 'line',
          data: targetData,
          symbol: 'none',
          lineStyle: {
            color: '#FFD15C',
            width: 2,
            type: 'dashed',
          },
        },
      ],
    };
  }
}
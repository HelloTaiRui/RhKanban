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

/** 季度数据接口 */
interface QuarterData {
  quarter: string;       // Q1, Q2, Q3, Q4
  target: number;        // 季度目标
  actual: number;        // 季度实际
  rate: number;          // 季度达成率（百分比）
}

@Component({
  selector: 'rh-sales-target-board',
  templateUrl: './sales-target-board.component.html',
  styleUrls: ['./sales-target-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SalesTargetBoardComponent extends RhvBoardBase {
  public enableMock: boolean = false;

  /** 当前季度索引 (0=Q1, 1=Q2, 2=Q3, 3=Q4) */
  currentQuarterIndex: number = 0;

  /** 四个季度的数据列表 */
  quarterDataList: QuarterData[] = [];

  /** 动画状态 */
  isAnimating: boolean = false;

  /** 季度名称列表 */
  quarterNames: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  /** 滑动检测相关变量 */
  private touchStartY: number = 0;
  private touchCurrentY: number = 0;
  private isDragging: boolean = false;
  private readonly SWIPE_THRESHOLD: number = 50; // 滑动触发阈值

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

  /** 根据当前月份计算默认季度索引 */
  getCurrentQuarterByMonth(): number {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 1 && month <= 3) return 0;   // Q1
    if (month >= 4 && month <= 6) return 1;   // Q2
    if (month >= 7 && month <= 9) return 2;   // Q3
    return 3;                                  // Q4
  }

  /** 从月度趋势数据计算四个季度的数据 */
  calculateQuarterData(monthlyTrend: MonthlySalesItem[]): QuarterData[] {
    if (!monthlyTrend || monthlyTrend.length === 0) {
      return this.quarterNames.map(name => ({
        quarter: name,
        target: 0,
        actual: 0,
        rate: 0
      }));
    }

    const quarters: QuarterData[] = [];
    const quarterMonths = [
      [0, 1, 2],   // Q1: 1月、2月、3月
      [3, 4, 5],   // Q2: 4月、5月、6月
      [6, 7, 8],   // Q3: 7月、8月、9月
      [9, 10, 11]  // Q4: 10月、11月、12月
    ];

    quarterMonths.forEach((months, index) => {
      let target = 0;
      let actual = 0;

      months.forEach(m => {
        if (monthlyTrend[m]) {
          target += monthlyTrend[m].target || 0;
          actual += monthlyTrend[m].actual || 0;
        }
      });

      const rate = target > 0 ? (actual / target) * 100 : 0;

      quarters.push({
        quarter: this.quarterNames[index],
        target,
        actual,
        rate
      });
    });

    return quarters;
  }

  /** 获取当前显示的季度数据 */
  get currentQuarterData(): QuarterData {
    return this.quarterDataList[this.currentQuarterIndex] || {
      quarter: 'Q1',
      target: 0,
      actual: 0,
      rate: 0
    };
  }

  /** 触摸/鼠标开始事件 */
  handleSwipeStart(event: TouchEvent | MouseEvent): void {
    if (this.isAnimating) return;

    this.isDragging = true;
    if (event instanceof TouchEvent) {
      this.touchStartY = event.touches[0].clientY;
    } else {
      this.touchStartY = event.clientY;
    }
  }

  /** 触摸/鼠标移动事件 */
  handleSwipeMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;

    if (event instanceof TouchEvent) {
      this.touchCurrentY = event.touches[0].clientY;
    } else {
      this.touchCurrentY = event.clientY;
    }
  }

  /** 触摸/鼠标结束事件 */
  handleSwipeEnd(): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    const deltaY = this.touchStartY - this.touchCurrentY;

    if (Math.abs(deltaY) >= this.SWIPE_THRESHOLD) {
      if (deltaY > 0) {
        // 向上滑动 -> 下一个季度
        this.switchToNextQuarter();
      } else {
        // 向下滑动 -> 上一个季度
        this.switchToPrevQuarter();
      }
    }

    this.touchStartY = 0;
    this.touchCurrentY = 0;
  }

  /** 切换到下一季度 */
  switchToNextQuarter(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    // Q4 -> Q1 循环
    this.currentQuarterIndex = (this.currentQuarterIndex + 1) % 4;

    // 动画结束后重置状态
    setTimeout(() => {
      this.isAnimating = false;
    }, 350);
  }

  /** 切换到上一季度 */
  switchToPrevQuarter(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    // Q1 -> Q4 循环
    this.currentQuarterIndex = (this.currentQuarterIndex - 1 + 4) % 4;

    // 动画结束后重置状态
    setTimeout(() => {
      this.isAnimating = false;
    }, 350);
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
        // 1. 转换 monthlyTrend 格式
        const monthlyTrend = data?.monthTargets?.map((m: RhSafeAny) => ({
          month: m.month,
          target: m.monthTarget,
          actual: m.monthActual
        })) || [];

        // 2. 提取当前月数据
        const currentMonth = new Date().getMonth() + 1;
        const currentMonthData = data?.monthTargets?.find((m: RhSafeAny) => m.month === currentMonth);

        // 3. 提取今日数据
        const currentDay = new Date().getDate();
        const todayData = currentMonthData?.dayTargets?.find((d: RhSafeAny) => d.day === currentDay);

        // 4. 计算季度数据
        this.quarterDataList = this.calculateQuarterData(monthlyTrend);
        this.currentQuarterIndex = this.getCurrentQuarterByMonth();

        // 5. 提取近7日数据（从今天往前推7天）
        const dailyList: DailySalesItem[] = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const monthData = data?.monthTargets?.find((m: RhSafeAny) => m.month === month);
          const dayData = monthData?.dayTargets?.find((d: RhSafeAny) => d.day === day);
          dailyList.push({
            date: `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            target: dayData?.dayTarget || 0,
            actual: dayData?.dayActual || 0,
            rate: dayData?.dayRate || 0,
          });
        }

        // 6. 返回转换后的数据
        return {
          yearTarget: data?.yearTarget || 0,
          yearActual: data?.yearActual || 0,
          yearRate: data?.yearRate || 0,
          yearRemaining: data?.yearRemaining || 0,
          monthTarget: currentMonthData?.monthTarget || 0,
          monthActual: currentMonthData?.monthActual || 0,
          monthRate: currentMonthData?.monthRate || 0,
          dayTarget: todayData?.dayTarget || 0,
          dayActual: todayData?.dayActual || 0,
          dayRate: todayData?.dayRate || 0,
          monthlyTrend,
          dailyList,
          updateTime: data?.updateTime || '',
        } as SalesTargetData;
      },
    }
  );

  /** 月度趋势图表配置 */
  get monthlyChartOption(): RhSafeAny {
    const data = this.salesData.data;
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const actualData = data?.monthlyTrend?.map((item: MonthlySalesItem) => item.actual / 10000) || [];
    const targetData = data?.monthlyTrend?.map((item: MonthlySalesItem) => item.target / 10000) || [];
    // 保存原始数据用于tooltip显示
    const originalActual = data?.monthlyTrend?.map((item: MonthlySalesItem) => item.actual) || [];
    const originalTarget = data?.monthlyTrend?.map((item: MonthlySalesItem) => item.target) || [];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: RhSafeAny[]) => {
          const monthIndex = params[0].dataIndex;
          let result = params[0].name + '<br/>';
          params.forEach((item: RhSafeAny) => {
            // 使用原始数据显示具体值
            const originalValue = item.seriesName === '实际销售额'
              ? originalActual[monthIndex]
              : originalTarget[monthIndex];
            result += `${item.marker} ${item.seriesName}: ¥${(originalValue || 0).toLocaleString()}<br/>`;
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
        top: '20%',
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
        scale: true,
        min: 0,
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
          label: {
            show: true,
            position: 'top',
            formatter: (params: RhSafeAny) => {
              const originalValue = originalActual[params.dataIndex] || 0;
              return '¥' + originalValue.toLocaleString();
            },
            color: '#A0AEC0',
            fontSize: 10,
          },
        },
        {
          name: '目标',
          type: 'line',
          data: targetData,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#FFD15C',
            width: 2,
            type: 'dashed',
          },
          itemStyle: {
            color: '#FFD15C',
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: RhSafeAny) => {
              const originalValue = originalTarget[params.dataIndex] || 0;
              return '¥' + originalValue.toLocaleString();
            },
            color: '#FFD15C',
            fontSize: 10,
          },
        },
      ],
    };
  }
}

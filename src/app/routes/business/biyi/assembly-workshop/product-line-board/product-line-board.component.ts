import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RhBoardData, RhSafeAny, RhvDisplayInstance, ExportFileHeaderInfo } from '@model';
import { RhColor, RhvBoardBase } from '@shared';
import {
  RhEquipmentStatus,
  useWorkEndTime,
  useWorkStartTime,
} from '../../data';
import { FileHelper, httpErrorFormatter, MockHelper, MsgHelper } from '@core';
import { of } from 'rxjs';
import { DetailTableConfig, monthTable, tables } from './board.utils';
import { format, addDays } from 'date-fns';

/** 年度数据-月度数据接口 */
interface MonthData {
  month: number;
  monthUPPH: number;
  monthPlanQty: number;
  monthFinishQty: number;
  monthFinishRate: number;
  monthQuantityRate: number;
  monthAndonNumber: number;
  monthAndonCloseNumber: number;
  monthAndonAmount: number;
  monthInspRate: number;
  monthResignationRate: number;
  monthBadMaterialReturnAmount: number;
  monthWorkBadMaterialReturnAmount: number;
}

/** 年度数据接口 */
interface YearData {
  year: number;
  yearUPPH: number;
  yearPlanQty: number;
  yearFinishQty: number;
  yearFinishRate: number;
  yearQuantityRate: number;
  yearAndonNumber: number;
  yearAndonCloseNumber: number;
  yearAndonAmount: number;
  yearInspRate: number;
  yearResignationRate: number;
  yearBadMaterialReturnAmount: number;
  yearWorkBadMaterialReturnAmount: number;
  monthlyData: MonthData[];
}

/** 年度数据响应接口 - postOuter会自动解包attach */
interface YearDataResponse {
  currentYear: YearData;
  lastYear: YearData;
}

/** 年度数据表格行接口 */
interface YearTableRow {
  indicator: string;
  key: string;
  isPercent: boolean;
  months: (number | string)[];
  yearSummary: number | string;
}

const createDemoData = () => {
  const lines = [
    'Z01',
    'Z02',
    'Z03',
    'Z04',
    'Z05',
    'Z06',
    'Z07',
    'Z08',
    'Z09',
    'Z10',
    'Z11',
    'Z12',
    'Z13',
  ];
  return lines.map(
    (line) =>
      new RhBoardData(line, null, [
        new RhBoardData('当月', null, [
          new RhBoardData('计划达成率', 100),
          new RhBoardData('一次合格率', 98),
          new RhBoardData('安灯停线', 1000),
          new RhBoardData('异常费用', 1000),
          new RhBoardData('验货异常', 2),
          new RhBoardData('月度离职率', 12),
          new RhBoardData('产线人均产值', 230),
          new RhBoardData('产线退料数量', 120),
          new RhBoardData('用电统计', 139),
        ]),
        new RhBoardData('产线状态', null, [
          {
            item: '实时状态',
            value1: 1,
            value2: null,
            value3: null,
          },
          {
            item: '00:00~08:30',
            value1: 2,
            value2: 1765123200000,
            value3: 1765153800000,
          },
          {
            item: '08:30~09:50',
            value1: 5,
            value2: 1765153800000,
            value3: 1765158600000,
          },
          {
            item: '09:50~10:00',
            value1: 5,
            value2: 1765158600000,
            value3: 1765159200000,
          },
          {
            item: '10:00~10:09',
            value1: 3,
            value2: 1765159200000,
            value3: 1765159757000,
          },
          {
            item: '10:09~11:10',
            value1: 1,
            value2: 1765159757000,
            value3: 1765163419000,
          },
          {
            item: '11:10~11:20',
            value1: 3,
            value2: 1765163419000,
            value3: 1765164000000,
          },
          {
            item: '11:20~12:20',
            value1: 2,
            value2: 1765164000000,
            value3: 1765167600000,
          },
          {
            item: '12:20~14:29',
            value1: 1,
            value2: 1765167600000,
            value3: 1765175364000,
          },
          {
            item: '14:29~14:38',
            value1: 3,
            value2: 1765175364000,
            value3: 1765175917000,
          },
          {
            item: '14:38~14:50',
            value1: 1,
            value2: 1765175917000,
            value3: 1765176600000,
          },
          {
            item: '14:50~15:00',
            value1: 2,
            value2: 1765176600000,
            value3: 1765177200000,
          },
          {
            item: '15:00~17:00',
            value1: 1,
            value2: 1765177200000,
            value3: 1765184400000,
          },
          {
            item: '17:00~17:30',
            value1: 2,
            value2: 1765184400000,
            value3: 1765186200000,
          },
          {
            item: '17:30~19:00',
            value1: 1,
            value2: 1765186200000,
            value3: 1765191600000,
          },
          {
            item: '19:00~19:10',
            value1: 2,
            value2: 1765191600000,
            value3: 1765192200000,
          },
        ]),
        new RhBoardData('A011', null, [
          new RhBoardData('计划', 200),
          new RhBoardData('实际', 200),
          new RhBoardData('不良', 2),
          new RhBoardData('码垛数', 200),
          new RhBoardData('达成率', 100),
          new RhBoardData('日均人员效率', 98),
          new RhBoardData('一次合格率', 97),
          new RhBoardData('产线状态', 100),
        ]),
        new RhBoardData('A012', null, [
          new RhBoardData('计划', 200),
          new RhBoardData('实际', 200),
          new RhBoardData('不良', 2),
          new RhBoardData('码垛数', 200),
          new RhBoardData('达成率', 100),
          new RhBoardData('日均人员效率', 98),
          new RhBoardData('一次合格率', 97),
          new RhBoardData('产线状态', 100),
        ]),
      ]),
  );
};

interface WorkshopInfo {
  category: string;
}

@Component({
  selector: 'rhv-product-line-board',
  templateUrl: './product-line-board.component.html',
  styleUrls: ['./product-line-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductLineBoardComponent extends RhvBoardBase {
  public enableMock: boolean = false;

  widthConfig = [
    '8rem',
    '10rem',
    '4rem',
    '4rem',
    '3.5rem',
    '4.5rem',
    '5rem',
    '5rem',
    '5rem',
    '5rem',
    '5rem',
    '5rem',
    '',
    '5rem',
    '5rem',
    '5rem',
    '5rem',
    '4rem',
    '4.5rem',
    '5rem',
    '5rem',
    '6rem',
    '6rem',
    '5rem',
  ];

  stateNameMap = {
    [RhEquipmentStatus.Rest]: '休息',
    [RhEquipmentStatus.Running]: '运行',
    [RhEquipmentStatus.Unknown]: '未知',
    [RhEquipmentStatus.Down]: '停线',
    [RhEquipmentStatus.StandBy]: '空闲',
    [RhEquipmentStatus.Error]: '异常',
  };
  stateColorMap = {
    [RhEquipmentStatus.Rest]: '#aaf775', //'rgb(198, 224, 180)',
    [RhEquipmentStatus.Running]: RhColor.Success,
    [RhEquipmentStatus.Unknown]: RhColor.Gray,
    [RhEquipmentStatus.Down]: RhColor.Danger,
    [RhEquipmentStatus.StandBy]: 'rgb(211, 211, 211)',
    [RhEquipmentStatus.Error]: RhColor.Warning,
  };

  /** 记住选择的车间 */
  workshopStorageKey: string = '_biyi_product_line_board_workshop';
  /** 车间信息 */
  workshopInfo = new RhvDisplayInstance(
    this,
    null,
    {
      data$: of([
        { category: '咖啡机' },
        { category: '城东空炸' },
        { category: '中意空炸' },
        { category: '两季' },
      ]),
      interval: 60000,
    },
    {
      category: localStorage.getItem(this.workshopStorageKey) || '空炸',
    },
  );
  /** 选择的月份 */
  monthInfo: Date = new Date();
  /** 格式化后的月份值 */
  formattedMonth: string = format(new Date(), 'yyyy-MM');
  //今天
  formattedDate0: string = format(new Date(), 'yyyy-MM-dd');
  // 明天
  formattedDate1: string = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  // 后天
  formattedDate2: string = format(addDays(new Date(), 2), 'yyyy-MM-dd');
  /** 处理月份变更事件 */
  /**
 * 处理月份变更事件
 * @param {Date} month - 选中的月份日期对象
 * @returns {void}
 */
handleMonthChanged(month: Date) {
    //console.log(month);
    const value = format(month, 'yyyy-MM');
    if (value === this.formattedMonth) return;
    this.formattedMonth = value;
    this.monthData.dataset.dataLoading = true;
    this.monthData.reloadData();
  }

  /** 车间下的产线信息 */
  linesData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: () =>
        this.apiSer.getOuter(
          'ZhuSuCheJian',
          'GetZhusuGraphLineDashboard_LinesByCategory',
          { category: this.workshopInfo.dataset.category },
        ),
      interval: null,
      onData: (data: string[]) => {
        const summary = [
          '汇总',
          '-',
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          '',
          0,
          0,
          0,
          [0, 0],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ];
        const linesList: string[] = [];
        const result = {
          summaryData: summary,
          linesData: data.map((line) => {
            linesList.push(line);
            const lineData = {
              name: line,
              monthlyData: MockHelper.genArr(11, () => '--'),
              todayData: [MockHelper.genArr(11, () => '--')],
              stateData: new RhBoardData('', null),
            };
            return lineData;
          }),
        };
        console.log('result', result);
        this.linesData.dataset.dataLoading = false;
        this.linesData.dataset.linesList = linesList;
        this.linesData.dataset.result = result;
        this.todayData.dataset.dataLoading = true;
        this.stateData.dataset.dataLoading = true;
        this.monthData.dataset.dataLoading = true;
        this.todayData.reloadData();
        this.monthData.reloadData();
        this.stateData.reloadData();
      },
    },
    {
      result: {
        summaryData: ['汇总', ...MockHelper.genArr(23, () => '--')],
        linesData: MockHelper.genArr(13, (i) => {
          return {
            name: `Z${(i + 1 + '').padStart(2, '0')}`,
            todayData: [MockHelper.genArr(11, () => '--')],
            monthlyData: MockHelper.genArr(11, () => '--'),
            stateData: new RhBoardData('', null),
          };
        }),
      },
      linesList: [],
      dataLoading: true,
    },
  );
  /** 各产线当日数据 */
  todayData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: () => {
        return this.apiSer.postOuter(
          'ZhuSuCheJian',
          'GetZhusuGraphLineDashboard_Daily',
          {
            yearMonth: '',
            workLines: this.linesData.dataset.linesList,
          },
          'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph1.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
          false,
        );
      },
      interval: 60000 * 5,
      onData: (data: any[]) => {
        this.todayData.dataset.dataLoading = false;
        // let productSum = 0; //产品总数，用来算平均值
        const validCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const summary = ['-', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.linesData.dataset.result.linesData.forEach((line) => {
          const item = data.find((el) => el.lineName == line.name);
          if (item) {
            // productSum += 1;
            const values = [
              item.itemName,
              item.dayPlanQty,
              item.dayFinishQty,
              item.dayBadQty,
              item.dayLineEmployeeQty,
              item.dayFinishRate,
              item.dayUPPH,
              item.dayQuantityRate,
              item.dayCompletenessRate0,
              item.dayCompletenessRate1,
              item.dayCompletenessRate2,
            ];
            values.forEach((el, i) => {
              if (typeof el === 'number') {
                summary[i] += el as RhSafeAny;
                if (el !== 0 && !isNaN(el)) {
                  validCounts[i]++;
                }
              }
            });
            line.todayData = [values];
          }
        });
        const avgItem = [5, 6, 7, 8, 9, 10];
        const sumItem = [1, 2, 3, 4];
        // avgItem.forEach((index) => {
        //   summary[index] =
        //     productSum === 0
        //       ? 0
        //       : this.unifyNumber((summary[index] as number) / productSum, 2);
        // });

        //平均值计算去掉数值为0的
        avgItem.forEach((index) => {
          const validCount = validCounts[index];
          summary[index] =
            validCount === 0
              ? 0
              : this.unifyNumber((summary[index] as number) / validCount, 2);
        });
        sumItem.forEach((index) => {
          summary[index] = this.unifyNumber(summary[index] as number, 2);
        });
        summary.forEach(
          (item, index) =>
            (this.linesData.dataset.result.summaryData[index + 1] = item),
        );
      },
    },
    {
      dataLoading: true,
    },
  );
  /** 产线状态 */
  stateData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: () => {
        if (this.workshopInfo.dataset.category !== '城东空炸') {
          return of(
            new RhBoardData(
              '',
              null,
              this.linesData.dataset.result.linesData.map((line) => {
                return new RhBoardData(
                  line.name,//.replace('-', '').replace('线', ''),
                  null,
                  [new RhBoardData('', null), new RhBoardData('', 0, [], 0, 0)],
                );
              }),
            ),
          );
        }
        return this.apiSer.postOuter(
          'ZhiZao',
          'ZhizaoGraph9',
          this.linesData.dataset.linesList,
          'assets/mock/biyi/ZhiZao/ZhizaoGraph9.json',
          this.enableMock,
        );
      },
      convertor: (data: RhBoardData) => {
        const lines = data?.children || [];
        return lines.map((item) => {
          return new RhBoardData(item.item, null, item.children.slice(1));
        });
      },
      onData: (data) => {
        this.stateData.dataset.dataLoading = false;
        this.linesData.dataset.result.linesData.forEach((line) => {
          const lineKey = line.name;//.replace('-', '').replace('线', '');
          const item = data.find((el) => el.item == lineKey);
          if (item) {
            line.stateData = item;
          } else {
            line.stateData = new RhBoardData(line.name, null, []);
          }
        });
        console.log(this.linesData.dataset);
      },
      interval: 60000,
    },
    {
      curTime: null,
      timelineTicks: ['07:30', '11:00', '14:30', '18:00'],
      lastTick: '21:30',
      createStartTime: useWorkStartTime,
      createEndTime: useWorkEndTime,
      dataLoading: true,
    },
  );

  /** 各产线月度数据 */
  monthData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: () => {
        return this.apiSer.postOuter(
          'ZhuSuCheJian',
          'GetZhusuGraphLineDashboard_Monthly',
          {
            yearMonth: this.formattedMonth,
            workLines: this.linesData.dataset.linesList,
          },
          'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph1.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
          false,
        );
      },
      interval: 60000 * 5,
      onData: (data: any[]) => {
        //console.log(data);
        this.monthData.dataset.dataLoading = false;
        const lines = this.linesData.dataset.result.linesData;
        const validCounts = [0, 0, 0, [0, 0], 0, 0, 0, 0, 0, 0, 0];
        const summary = [0, 0, 0, [0, 0], 0, 0, 0, 0, 0, 0, 0];
        lines.forEach((line) => {
          const item = data.find((el) => el.lineName == line.name);
          if (item) {
            const values = [
              item.monthFinishQty,
              item.monthFinishRate,
              item.monthQuantityRate,
              [item.monthAndonNumber, item.monthAndonNumber],
              item.monthAndonAmount,
              item.monthInspRate,
              item.monthResignationRate,
              item.monthUPPH,
              item.monthBadMaterialReturnAmount,
              item.monthWorkBadMaterialReturnAmount,
              item.energy,
            ];
            values.forEach((el, i) => {
              if (i == 3) {
                //安灯特殊处理
                summary[i][0] += (el[0] as RhSafeAny) || 0;
                summary[i][1] += (el[1] as RhSafeAny) || 0;
                return [el[0] || 0, el[1] || 0];
              }
              if (typeof el === 'number') {
                summary[i] += el as RhSafeAny;
                if (el !== 0 && !isNaN(el)) {
                  (validCounts[i] as number)++;
                }
              }
            });
            line.monthlyData = values;
          }
        });
        const monthlyAgvItem = [1, 2, 5, 6, 7];
        const sumItem = [0, 3, 4, 8, 9, 10];
        // monthlyAgvItem.forEach((index) => {
        //   summary[index] =
        //     lines.length === 0
        //       ? 0
        //       : this.unifyNumber((summary[index] as number) / lines.length, 2);
        // });
        //平均值计算去掉数值为0的
        monthlyAgvItem.forEach((index) => {
          const validCount = validCounts[index];
          summary[index] =
            lines.length === 0
              ? 0
              : this.unifyNumber(
                  (summary[index] as number) / (validCount as number),
                  2,
                );
        });
        sumItem.forEach((index) => {
          if (Array.isArray(summary[index])) {
            summary[index] = (summary[index] as number[]).map((item) =>
              this.unifyNumber(item, 2),
            );
          } else {
            summary[index] = this.unifyNumber(summary[index] as number, 2);
          }
        });
        summary.forEach(
          (item, index) =>
            (this.linesData.dataset.result.summaryData[index + 13] = item),
        );
      },
    },
    {
      dataLoading: true,
    },
  );

  /** 年度数据弹框可见性 */
  yearModalVisible = false;
  /** 年度数据加载中 */
  yearDataLoading = false;
  /** 当前选中的产线名称 */
  curYearLineName: string = '';
  /** 当前选中的Tab（当年/去年） */
  curYearTab: 'current' | 'last' = 'current';
  /** 年度数据响应 */
  yearData: YearDataResponse | null = null;

  /** 获取当前年份 */
  get currentYearValue(): number | null {
    return this.yearData?.currentYear?.year ?? null;
  }

  /** 获取去年年份 */
  get lastYearValue(): number | null {
    return this.yearData?.lastYear?.year ?? null;
  }

  /** 年度数据表格配置 */
  yearTableConfig = [
    { key: 'PlanQty', indicator: '计划数', isPercent: false },
    { key: 'FinishQty', indicator: '完工数', isPercent: false },
    { key: 'FinishRate', indicator: '计划达成率', isPercent: true },
    { key: 'QuantityRate', indicator: '一次合格率', isPercent: true },
    { key: 'AndonNumber', indicator: '安灯停线', isPercent: false },
    { key: 'AndonAmount', indicator: '异常费用', isPercent: false },
    { key: 'InspRate', indicator: '验货合格率', isPercent: true },
    { key: 'ResignationRate', indicator: '月度离职率', isPercent: true },
    { key: 'UPPH', indicator: 'UPPH值', isPercent: false },
    { key: 'BadMaterialReturnAmount', indicator: '退料金额(料费)', isPercent: false },
    { key: 'WorkBadMaterialReturnAmount', indicator: '退料金额(工费)', isPercent: false },
  ];

  /** 详情弹窗可见性 */
  detailModalVisible = false;
  /** 详情数据加载中 */
  detailDataLoading = false;
  /** 明细数据 */
  detailsData = [];
  /** 当前选中的产线 */
  curLineCode: string;
  /** 明细接口的查询 */
  private detailsQueryTime: number;

  /** 当前明细表格配置 */
  curDetailTable: DetailTableConfig = {
    title: '明细表格',
    api: '',
    columns: [],
  };

  /** 查询产线对应的不良详情 */
  async handleShowDetail(lineCode: string, type: string) {
    //console.log(lineCode);
    try {
      this.detailModalVisible = true;
      this.detailDataLoading = true;
      this.curLineCode = lineCode;
      this.detailsData = [];
      const item = tables[type];
      this.curDetailTable = item;
      const time = Date.now();
      this.detailsQueryTime = time;
      const result = await this.apiSer
        .getOuter<RhSafeAny[]>(
          'ZhuSuCheJian',
          item.api,
          {
            lineKey: lineCode,
            yearMonth: this.formattedMonth,
          },
          'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph2.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
          false,
        )
        .toPromise();
      if (time !== this.detailsQueryTime) return;
      this.detailsData = item.formatter ? item.formatter(result) : result;
      this.detailDataLoading = false;
    } catch (error) {
      MsgHelper.ShowErrorMessage(
        `获取详情数据失败！错误详情：${httpErrorFormatter(error)}`,
      );
    }
    this.detailDataLoading = false;
  }
  getWorkDate(type: string): string {
    const dateMap: Record<string, string> = {
      KitInfos0: this.formattedDate0,
      KitInfos2: this.formattedDate1,
      KitInfos3: this.formattedDate2,
    };
    return dateMap[type] || this.formattedDate0;
  }
  async handleShowDayDetail(lineCode: string, type: string) {
    try {
      this.detailModalVisible = true;
      this.detailDataLoading = true;
      this.curLineCode = lineCode;
      this.detailsData = [];
      const item = tables[type];
      this.curDetailTable = item;
      const time = Date.now();
      this.detailsQueryTime = time;
      const result = await this.apiSer
        .getOuter<RhSafeAny[]>(
          'ZhuSuCheJian',
          item.api,
          {
            lineKey: lineCode,
            workDate: this.getWorkDate(type),
          },
          'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph2.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
          false,
        )
        .toPromise();
      if (time !== this.detailsQueryTime) return;
      this.detailsData = item.formatter ? item.formatter(result) : result;
      this.detailDataLoading = false;
    } catch (error) {
      MsgHelper.ShowErrorMessage(
        `获取详情数据失败！错误详情：${httpErrorFormatter(error)}`,
      );
    }
    this.detailDataLoading = false;
  }
  /** 车间选择面板是否可见 */
  workshopSelectModalVisible = false;

  /** 打开车间选择面板 */
  openWorkshopSelectModal = () => {
    this.workshopSelectModalVisible = true;
  };
  /** 点中车间项后 */
  onClickItem(item: WorkshopInfo) {
    this.workshopInfo.dataset.category = item.category;
    this.linesData.reloadData();
    this.workshopSelectModalVisible = false;
    if (this.workshopStorageKey) {
      localStorage.setItem(this.workshopStorageKey, item.category);
    }
  }
  /** 导出明细数据 */
  handleExportDetailsData() {
    const item = this.curDetailTable;
    const title = this.curLineCode + item.title;
    FileHelper.exportTableDataToExcelFile(
      this.detailsData,
      item.exportColumns,
      null,
      title,
      title + '_' + format(new Date(), 'yyyyMMdd_HH:mm:ss'),
    );
  }
  /** 导出月度数据 */
  handleExportMonthData() {
    const item = monthTable;
    const title =
      this.workshopInfo.dataset.category +
      '_' +
      this.formattedMonth +
      '当月产线信息数据统计';
    const data = this.monthData.data;
    FileHelper.exportTableDataToExcelFile(
      data,
      item.exportColumns,
      null,
      title,
      title + '_' + format(new Date(), 'yyyyMMdd_HH:mm:ss'),
    );
  }

  /** 显示年度数据弹框 */
  async handleShowYearData(lineName: string) {
    try {
      this.yearModalVisible = true;
      this.yearDataLoading = true;
      this.curYearLineName = lineName;
      this.curYearTab = 'current';
      this.yearData = null;

      // 转换产线名称格式：Z01 -> Z-01线
      const lineCode = lineName.replace(/^Z(\d+)$/, 'Z-$1线');

      const result = await this.apiSer
        .postOuter<YearDataResponse>(
          'ZhuSuCheJian',
          'GetZhusuGraphLineDashboard_Yearly',
          {
            yearMonth: format(new Date(), 'yyyy'),
            workLines: [lineCode],
          },
        )
        .toPromise();

      console.log('年度数据返回:', result);
      this.yearData = result;
      this.yearDataLoading = false;
    } catch (error) {
      console.error('年度数据错误:', error);
      MsgHelper.ShowErrorMessage(
        `获取年度数据失败！错误详情：${httpErrorFormatter(error)}`,
      );
    }
    this.yearDataLoading = false;
  }

  /** 获取当前Tab的年度数据 */
  getCurYearData(): YearData | null {
    if (!this.yearData) return null;
    return this.curYearTab === 'current'
      ? this.yearData.currentYear
      : this.yearData.lastYear;
  }

  /** 将年度数据转换为表格行数据 */
  transformYearDataToTableRows(data: YearData | null): YearTableRow[] {
    if (!data) return [];

    return this.yearTableConfig.map((config) => {
      const months: (number | string)[] = [];
      const monthKeyPrefix = 'month';

      // 填充1-12月数据
      for (let i = 1; i <= 12; i++) {
        const monthData = data.monthlyData.find((m) => m.month === i);
        if (monthData) {
          const value = (monthData as RhSafeAny)[`${monthKeyPrefix}${config.key}`];
          months.push(value ?? 0);
        } else {
          months.push(0);
        }
      }

      // 年度汇总
      const yearKey = `year${config.key}`;
      const yearSummary = (data as RhSafeAny)[yearKey] ?? 0;

      return {
        indicator: config.indicator,
        key: config.key,
        isPercent: config.isPercent,
        months,
        yearSummary,
      };
    });
  }

  /** 格式化年度数据表格值 */
  formatYearValue(value: number | string, isPercent: boolean): string {
    if (typeof value !== 'number' || isNaN(value)) return '--';
    if (isPercent) {
      return (value * 100).toFixed(2) + '%';
    }
    return value.toFixed(2);
  }

  /** 处理Tab切换 */
  handleYearTabChange(tab: 'current' | 'last') {
    this.curYearTab = tab;
  }

  /** 导出年度数据 */
  handleExportYearData() {
    if (!this.yearData) return;

    const yearData = this.getCurYearData();
    if (!yearData) return;

    const title = `${this.curYearLineName}_${yearData.year}年度数据统计`;
    const rows = this.transformYearDataToTableRows(yearData);

    // 构建导出数据
    const exportData: RhSafeAny[] = rows.map((row) => {
      const obj: RhSafeAny = {
        指标: row.indicator,
      };
      // 月份
      for (let i = 0; i < 12; i++) {
        obj[`${i + 1}月`] = row.months[i];
      }
      obj['年度汇总'] = row.yearSummary;
      return obj;
    });

    // 构建导出列头
    const exportColumns: ExportFileHeaderInfo[] = [
      new ExportFileHeaderInfo('指标', '指标'),
    ];
    for (let i = 1; i <= 12; i++) {
      exportColumns.push(new ExportFileHeaderInfo(`${i}月`, `${i}月`));
    }
    exportColumns.push(new ExportFileHeaderInfo('年度汇总', '年度汇总'));

    FileHelper.exportTableDataToExcelFile(
      exportData,
      exportColumns,
      null,
      title,
      title + '_' + format(new Date(), 'yyyyMMdd_HH:mm:ss'),
    );
  }
}

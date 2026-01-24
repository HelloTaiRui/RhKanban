import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RhBoardData, RhSafeAny, RhvDisplayInstance } from '@model';
import { RhColor, RhvBoardBase } from '@shared';
import {
  RhEquipmentStatus,
  useWorkEndTime,
  useWorkStartTime,
  workTimelineTicks,
} from '../../data';
import { last } from 'lodash';
import { httpErrorFormatter, MockHelper, MsgHelper } from '@core';
import { of } from 'rxjs';
import { DetailTableConfig, tables } from './board.utils';
import { format } from 'date-fns';

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
      ])
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
    '4.5rem',
    '10rem',
    '4rem',
    '4rem',
    '3.5rem',
    '4.5rem',
    '5rem',
    '5rem',
    '5rem',
    '',
    '5rem',
    '5rem',
    '5rem',
    '4rem',
    '4.5rem',
    '5rem',
    '5rem',
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
        { category: '空炸' },
        { category: '两季' },
      ]),
      interval: 60000,
    },
    {
      category: localStorage.getItem(this.workshopStorageKey) || '空炸',
    }
  );
  /** 选择的月份 */
  monthInfo: Date = new Date();
  /** 格式化后的月份值 */
  formattedMonth: string = format(new Date(), 'yyyy-MM');
  /** 处理月份变更事件 */
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
          { category: this.workshopInfo.dataset.category }
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
          '',
          0,
          0,
          [0, 0],
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
              monthlyData: MockHelper.genArr(9, () => '--'),
              todayData: [MockHelper.genArr(8, () => '--')],
              stateData: new RhBoardData('', null),
            };
            return lineData;
          }),
        };
        //console.log(result);
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
        summaryData: ['汇总', ...MockHelper.genArr(18, () => '--')],
        linesData: MockHelper.genArr(13, (i) => {
          return {
            name: `Z${(i + 1 + '').padStart(2, '0')}`,
            todayData: [MockHelper.genArr(8, () => '--')],
            monthlyData: MockHelper.genArr(9, () => '--'),
            stateData: new RhBoardData('', null),
          };
        }),
      },
      linesList: [],
      dataLoading: true,
    }
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
          false
        );
      },
      interval: 60000 * 5,
      onData: (data: any[]) => {
        this.todayData.dataset.dataLoading = false;
        let productSum = 0; //产品总数，用来算平均值
        const summary = ['-', 0, 0, 0, 0, 0, 0, 0];
        this.linesData.dataset.result.linesData.forEach((line) => {
          const item = data.find((el) => el.lineName == line.name);
          if (item) {
            productSum += 1;
            const values = [
              item.itemName,
              item.dayPlanQty,
              item.dayFinishQty,
              item.dayBadQty,
              item.dayLineEmployeeQty,
              item.dayFinishRate,
              item.dayUPPH,
              item.dayQuantityRate,
            ];
            values.forEach((el, i) => {
              if (typeof el === 'number') {
                summary[i] += el as RhSafeAny;
              }
            });
            line.todayData = [values];
          }
        });
        const avgItem = [5, 6, 7];
        const sumItem = [1, 2, 3, 4];
        avgItem.forEach((index) => {
          summary[index] =
            productSum === 0
              ? 0
              : this.unifyNumber((summary[index] as number) / productSum, 2);
        });
        sumItem.forEach((index) => {
          summary[index] = this.unifyNumber(summary[index] as number, 2);
        });
        summary.forEach(
          (item, index) =>
            (this.linesData.dataset.result.summaryData[index + 1] = item)
        );
      },
    },
    {
      dataLoading: true,
    }
  );
  /** 产线状态 */
  stateData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: () => {
        if (this.workshopInfo.dataset.category !== '空炸') {
          return of(
            new RhBoardData(
              '',
              null,
              this.linesData.dataset.result.linesData.map((line) => {
                return new RhBoardData(
                  line.name.replace('-', '').replace('线', ''),
                  null,
                  [new RhBoardData('', null), new RhBoardData('', 0, [], 0, 0)]
                );
              })
            )
          );
        }
        return this.apiSer.getOuter(
          'ZhiZao',
          'ZhizaoGraph9',
          {},
          'assets/mock/biyi/ZhiZao/ZhizaoGraph9.json',
          this.enableMock
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
          const lineKey = line.name.replace('-', '').replace('线', '');
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
    }
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
          false
        );
      },
      interval: 60000 * 5,
      onData: (data: any[]) => {
        //console.log(data);
        this.monthData.dataset.dataLoading = false;
        const lines = this.linesData.dataset.result.linesData;
        const summary = [0, 0, [0, 0], 0, 0, 0, 0, 0, 0];
        lines.forEach((line) => {
          const item = data.find((el) => el.lineName == line.name);
          if (item) {
            const values = [
              item.monthFinishRate,
              item.monthQuantityRate,
              [item.monthAndonNumber, item.monthAndonNumber],
              item.monthAndonAmount,
              item.monthInspRate,
              item.monthResignationRate,
              item.monthUPPH,
              item.monthBadMaterialReturnAmount,
              item.energy,
            ];
            values.forEach((el, i) => {
              if (i == 2) {
                //安灯特殊处理
                summary[i][0] += (el[0] as RhSafeAny) || 0;
                summary[i][1] += (el[1] as RhSafeAny) || 0;
                return [el[0] || 0, el[1] || 0];
              }
              if (typeof el === 'number') {
                summary[i] += el as RhSafeAny;
              }
            });
            line.monthlyData = values;
          }
        });
        const monthlyAgvItem = [0, 1, 4, 5, 6];
        const sumItem = [2, 3, 7, 8];
        monthlyAgvItem.forEach((index) => {
          summary[index] =
            lines.length === 0
              ? 0
              : this.unifyNumber((summary[index] as number) / lines.length, 2);
        });
        sumItem.forEach((index) => {
          if (Array.isArray(summary[index])) {
            summary[index] = (summary[index] as number[]).map((item) =>
              this.unifyNumber(item, 2)
            );
          } else {
            summary[index] = this.unifyNumber(summary[index] as number, 2);
          }
        });
        summary.forEach(
          (item, index) =>
            (this.linesData.dataset.result.summaryData[index + 10] = item)
        );
      },
    },
    {
      dataLoading: true,
    }
  );

  /** 详情弹窗可见性 */
  detailModalVisible = false;
  /** 详情数据加载中 */
  detailDataLoading = false;
  /** 明细数据 */
  detailsData = [];
  /** 当前选中的产线 */
  curLineCode: string;

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
      const result = await this.apiSer
        .getOuter<RhSafeAny[]>(
          'ZhuSuCheJian',
          item.api,
          {
            lineKey: lineCode,
            yearMonth: this.formattedMonth,
          },
          'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph2.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
          false
        )
        .toPromise();
      this.detailsData = item.formatter ? item.formatter(result) : result;
      this.detailDataLoading = false;
    } catch (error) {
      MsgHelper.ShowErrorMessage(
        `获取详情数据失败！错误详情：${httpErrorFormatter(error)}`
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
}

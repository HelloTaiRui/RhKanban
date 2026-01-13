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

@Component({
  selector: 'rhv-product-line-board',
  templateUrl: './product-line-board.component.html',
  styleUrls: ['./product-line-board.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductLineBoardComponent extends RhvBoardBase {
  public enableMock: boolean = false;

  widthConfig = [
    '3.5rem',
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
    '5rem',
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

  tableData = new RhvDisplayInstance(
    this,
    null,
    {
      data$: this.apiSer.getOuter(
        'ZhuSuCheJian',
        'GetZhusuGraphLineDashboard',
        {},
        'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph1.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
        false
      ),
      interval: 60000 * 5,
      emptyData: () => ({
        summaryData: ['汇总', ...MockHelper.genArr(18, () => '--')],
        linesData: MockHelper.genArr(13, (i) => {
          return {
            name: `Z${(i + 1 + '').padStart(2, '0')}`,
            todayData: [MockHelper.genArr(8, () => '--')],
            monthlyData: MockHelper.genArr(9, () => '--'),
            stateData: new RhBoardData('', null),
          };
        }),
      }),
      convertor: (data: RhBoardData) => {
        //console.log(data);
        this.tableData.dataset.dataLoading = false;
        const lines = data.children;
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
        let productSum = 0; //产品总数，用来算平均值
        const result = {
          summaryData: summary,
          linesData: lines.map((line) => {
            const lineData = {
              name: line.item,
              monthlyData: [],
              todayData: [],
              stateData: new RhBoardData('', null),
            };
            const monthlyData = line.children[0];
            const stateData = line.children[1];
            const todayData = line.children.slice(2);
            lineData.monthlyData = monthlyData.children.map((item, index) => {
              if (index == 2) {
                //安灯特殊处理
                summary[index + 10][0] += (item.value1 as RhSafeAny) || 0;
                summary[index + 10][1] += (item.value2 as RhSafeAny) || 0;
                return [item.value1 || 0, item.value2 || 0];
              }
              if (typeof item.value1 === 'number') {
                summary[index + 10] += item.value1 as RhSafeAny;
              }
              return item.value1;
            });
            lineData.todayData = todayData.map((item) => {
              productSum += 1;
              return [
                item.item,
                ...item.children.map((el, index) => {
                  if (typeof el.value1 === 'number') {
                    summary[index + 2] += el.value1 as RhSafeAny;
                  }
                  return el.value1;
                }),
              ];
            });
            lineData.stateData = new RhBoardData(
              stateData.item,
              null,
              stateData.children.slice(1)
            );
            return lineData;
          }),
        };
        const avgItem = [6, 7, 8];
        const monthlyAgvItem = [10, 11, 14, 15, 16];
        const sumItem = [2, 3, 4, 5, 12, 13, 17, 18];
        avgItem.forEach((index) => {
          summary[index] =
            productSum === 0
              ? 0
              : this.unifyNumber((summary[index] as number) / productSum, 2);
        });
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
        if (this.enableMock) {
          const dataDate = new Date(
            last(result.linesData[0].stateData.children).value3
          );
          const curTime = new Date();
          dataDate.setHours(21, 30, 0);
          this.tableData.dataset.curTime = dataDate;
        }
        return result;
      },
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
  /** 详情弹窗可见性 */
  detailModalVisible = false;
  /** 详情数据加载中 */
  detailDataLoading = false;
  /** 明细数据 */
  detailsData = [];
  curLineCode: string;

  /** 查询产线对应的不良详情 */
  async handleShowDetail(lineCode: string) {
    //console.log(lineCode);
    try {
      this.detailModalVisible = true;
      this.detailDataLoading = true;
      this.curLineCode = lineCode;
      this.detailsData = [];
      const result = await this.apiSer
        .getOuter<RhSafeAny[]>(
          'ZhuSuCheJian',
          'GetZhusuGraphLineDashboard_BadMaterialInfos?lineKey=' + lineCode,
          {},
          'assets/mock/biyi/ZuZhuangCheJian/ZuZhuangGraph2.json', //new RhBoardData('成品看线看板表格数据', null, createDemoData()),
          false
        )
        .toPromise();
      this.detailsData = result;
      this.detailDataLoading = false;
    } catch (error) {
      MsgHelper.ShowErrorMessage(
        `获取详情数据失败！错误详情：${httpErrorFormatter(error)}`
      );
    }
    this.detailDataLoading = false;
  }
}

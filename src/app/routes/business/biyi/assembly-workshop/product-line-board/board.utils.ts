import { ExportFileHeaderInfo, RhSafeAny } from '@model';
import { format } from 'date-fns';

class ColumnItem {
  constructor(
    public key: string,
    public title: string,
    public width: string,
  ) {}
}

export interface DetailTableConfig {
  title: string;
  api: string;
  columns: ColumnItem[];
  exportColumns?: ExportFileHeaderInfo[];
  formatter?: (data: RhSafeAny[]) => RhSafeAny[];
}

export const tables: Record<string, DetailTableConfig> = {
  BadMaterialInfos: {
    title: '退料明细',
    api: 'GetZhusuGraphLineDashboard_BadMaterialInfos',
    columns: [
      new ColumnItem('materialReturnNo', '退料单号', '9rem'),
      new ColumnItem('salesNo', '销售单号', '7rem'),
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '12rem'),
      new ColumnItem('itemSpec', '物料规格', ''),
      new ColumnItem('returnQty', '退料数量', '6rem'),
      new ColumnItem('price', '单价', '6rem'),
      new ColumnItem('amount', '总金额', '6rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('materialReturnNo', '退料单号'),
      new ExportFileHeaderInfo('salesNo', '销售单号'),
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('itemSpec', '物料规格'),
      new ExportFileHeaderInfo('returnQty', '退料数量'),
      new ExportFileHeaderInfo('price', '单价'),
      new ExportFileHeaderInfo('amount', '总金额'),
    ],
  },
  BadMaterialInfos2: {
    title: '退料明细',
    api: 'GetZhusuGraphLineDashboard_BadMaterialInfos2',
    columns: [
      new ColumnItem('materialReturnNo', '退料单号', '9rem'),
      new ColumnItem('salesNo', '销售单号', '7rem'),
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '12rem'),
      new ColumnItem('itemSpec', '物料规格', ''),
      new ColumnItem('returnQty', '退料数量', '6rem'),
      new ColumnItem('price', '单价', '6rem'),
      new ColumnItem('amount', '总金额', '6rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('materialReturnNo', '退料单号'),
      new ExportFileHeaderInfo('salesNo', '销售单号'),
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('itemSpec', '物料规格'),
      new ExportFileHeaderInfo('returnQty', '退料数量'),
      new ExportFileHeaderInfo('price', '单价'),
      new ExportFileHeaderInfo('amount', '总金额'),
    ],
  },
  AndonInfos: {
    title: '安灯记录',
    api: 'GetZhusuGraphLineDashboard_AndonInfos',
    columns: [
      new ColumnItem('andonNo', '呼叫单号', '9rem'),
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('departmentName', '部门', '6rem'),
      new ColumnItem('triggerName', '呼叫人', '6rem'),
      new ColumnItem('andonType', '呼叫类型', '7rem'),
      new ColumnItem('andonContent', '呼叫内容', ''),
      new ColumnItem('andonTime', '呼叫时间', '7rem'),
      new ColumnItem('andonCloseTime', '关闭时间', '7rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '12rem'),
      new ColumnItem('status', '安灯状态', '6rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('andonNo', '呼叫单号'),
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('departmentName', '部门'),
      new ExportFileHeaderInfo('triggerName', '呼叫人'),
      new ExportFileHeaderInfo('andonType', '呼叫类型'),
      new ExportFileHeaderInfo('andonContent', '呼叫内容'),
      new ExportFileHeaderInfo('andonTime', '呼叫时间'),
      new ExportFileHeaderInfo('andonCloseTime', '关闭时间'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('status', '安灯状态'),
    ],
  },
  EmployeeInfos: {
    title: '离职人员信息',
    api: 'GetZhusuGraphLineDashboard_RegisterEmployeeInfos',
    columns: [
      new ColumnItem('employeeName', '员工姓名', ''),
      new ColumnItem('gender', '性别', ''),
      new ColumnItem('employeeNumber', '员工编号', ''),
      new ColumnItem('joinTime', '入职时间', ''),
      new ColumnItem('registerTime', '注册时间', ''),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('employeeName', '员工姓名'),
      new ExportFileHeaderInfo('gender', '性别'),
      new ExportFileHeaderInfo('employeeNumber', '员工编号'),
      new ExportFileHeaderInfo('joinTime', '入职时间'),
      new ExportFileHeaderInfo('registerTime', '注册时间'),
    ],
  },
  InspectionInfos: {
    title: '验货信息',
    api: 'GetZhusuGraphLineDashboard_InspectionInfos',
    columns: [
      new ColumnItem('inspNo', '检验单号', '9rem'),
      new ColumnItem('salesNo', '销售单号', '8rem'),
      new ColumnItem('customerName', '客户名称', ''),
      new ColumnItem('itemCode', '产品编码', '8rem'),
      new ColumnItem('itemName', '产品名称', '15rem'),
      new ColumnItem('specialRequirement', '特殊要求', ''),
      new ColumnItem('pinZhiResult', '品质部检验结果', '8rem'),
      new ColumnItem('shiChangResult', '市场部检验结果', '8rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('inspNo', '检验单号'),
      new ExportFileHeaderInfo('salesNo', '销售单号'),
      new ExportFileHeaderInfo('customerName', '客户名称'),
      new ExportFileHeaderInfo('itemCode', '产品编码'),
      new ExportFileHeaderInfo('itemName', '产品名称'),
      new ExportFileHeaderInfo('specialRequirement', '特殊要求'),
      new ExportFileHeaderInfo('pinZhiResult', '品质部检验结果'),
      new ExportFileHeaderInfo('shiChangResult', '市场部检验结果'),
    ],
  },
  CompletenessInfos: {
    title: '齐套数据',
    api: 'GetZhusuGraphLineDashboard_CompletenessInfos',
    columns: [
      new ColumnItem('salesNo', '销售单号', '8rem'),
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('moStartTime', '工单开始时间', '8rem'),
      new ColumnItem('moFinishTime', '工单结束时间', '8rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '12rem'),
      new ColumnItem('itemSpec', '物料规格', ''),
      new ColumnItem('itemCategory', '物料类别', '6rem'),
      new ColumnItem('payableQty', '应付数量', '6rem'),
      new ColumnItem('sendQty', '已发数量', '6rem'),
      new ColumnItem('unSendQty', '未发数量', '6rem'),
      new ColumnItem('matchQty', '齐套数量', '6rem'),
    ],
    formatter: (data: any[]) => {
      data.forEach((item) => {
        if (item.moStartTime) {
          item.moStartTime = format(
            new Date(item.moStartTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
        if (item.moFinishTime) {
          item.moFinishTime = format(
            new Date(item.moFinishTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
      });
      return data;
    },
    exportColumns: [
      new ExportFileHeaderInfo('salesNo', '销售单号'),
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('moStartTime', '工单开始时间'),
      new ExportFileHeaderInfo('moFinishTime', '工单结束时间'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('itemSpec', '物料规格'),
      new ExportFileHeaderInfo('itemCategory', '物料类别'),
      new ExportFileHeaderInfo('payableQty', '应付数量'),
      new ExportFileHeaderInfo('sendQty', '已发数量'),
      new ExportFileHeaderInfo('unSendQty', '未发数量'),
      new ExportFileHeaderInfo('matchQty', '齐套数量'),
    ],
  },
  ExceptionHandledInfos: {
    title: '异常费用明细',
    api: 'GetZhusuGraphLineDashboard_ExceptionHandledInfos',
    columns: [
      new ColumnItem('exceptionHandleBillNo', '异常费用单号', '9rem'),
      new ColumnItem('andonNo', '安灯呼叫单号', '9rem'),
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '15rem'),
      new ColumnItem('type', '异常类型', ''),
      new ColumnItem('peopleNum', '人数', '4rem'),
      new ColumnItem('workHour', '工时', '5rem'),
      new ColumnItem('price', '单价', '6rem'),
      new ColumnItem('amount', '总金额', '6rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('exceptionHandleBillNo', '异常费用单号'),
      new ExportFileHeaderInfo('andonNo', '安灯呼叫单号'),
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('type', '异常类型'),
      new ExportFileHeaderInfo('peopleNum', '人数'),
      new ExportFileHeaderInfo('workHour', '工时'),
      new ExportFileHeaderInfo('price', '单价'),
      new ExportFileHeaderInfo('amount', '总金额'),
    ],
  },
  KitInfos0: {
    title: ' T0齐套数据',
    api: 'GetZhusuGraphLineDashboard_CompletenessInfos',
    columns: [
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('erpWarehouse', 'erp仓库', '9rem'),
      new ColumnItem('itemCategory', '项目分类', '9rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '15rem'),
      new ColumnItem('lineName', '项目规格', '6rem'),
      new ColumnItem('matchQty', '匹配数量', '6rem'),
      new ColumnItem('moStartTime', '开始时间', '12rem'),
      new ColumnItem('moFinishTime', '完成时间', '12rem'),
      new ColumnItem('payableQty', '应付数量', '6rem'),
      new ColumnItem('salesNo', '销售编号', '6rem'),
      new ColumnItem('sendQty', '发送数量', '6rem'),
      new ColumnItem('unSendQty', '没发送数量', '8rem'),
    ],
    formatter: (data: any[]) => {
      data.forEach((item) => {
        if (item.moStartTime) {
          item.moStartTime = format(
            new Date(item.moStartTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
        if (item.moFinishTime) {
          item.moFinishTime = format(
            new Date(item.moFinishTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
      });
      return data;
    },
    exportColumns: [
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('erpWarehouse', 'erp仓库'),
      new ExportFileHeaderInfo('itemCategory', '项目分类'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('lineName', '项目规格'),
      new ExportFileHeaderInfo('matchQty', '匹配数量'),
      new ExportFileHeaderInfo('moStartTime', '开始时间'),
      new ExportFileHeaderInfo('moFinishTime', '完成时间'),
      new ExportFileHeaderInfo('payableQty', '应付数量'),
      new ExportFileHeaderInfo('salesNo', '销售编号'),
      new ExportFileHeaderInfo('sendQty', '发送数量'),
      new ExportFileHeaderInfo('unSendQty', '没发送数量'),
    ],
  },
  KitInfos1: {
    title: ' T1齐套数据',
    api: 'GetZhusuGraphLineDashboard_CompletenessInfos',
    columns: [
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('erpWarehouse', 'erp仓库', '9rem'),
      new ColumnItem('itemCategory', '项目分类', '9rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '15rem'),
      new ColumnItem('lineName', '项目规格', '6rem'),
      new ColumnItem('matchQty', '匹配数量', '6rem'),
      new ColumnItem('moStartTime', '开始时间', '12rem'),
      new ColumnItem('moFinishTime', '完成时间', '12rem'),
      new ColumnItem('payableQty', '应付数量', '6rem'),
      new ColumnItem('salesNo', '销售编号', '6rem'),
      new ColumnItem('sendQty', '发送数量', '6rem'),
      new ColumnItem('unSendQty', '没发送数量', '8rem'),
    ],
    formatter: (data: any[]) => {
      data.forEach((item) => {
        if (item.moStartTime) {
          item.moStartTime = format(
            new Date(item.moStartTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
        if (item.moFinishTime) {
          item.moFinishTime = format(
            new Date(item.moFinishTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
      });
      return data;
    },
    exportColumns: [
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('erpWarehouse', 'erp仓库'),
      new ExportFileHeaderInfo('itemCategory', '项目分类'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('lineName', '项目规格'),
      new ExportFileHeaderInfo('matchQty', '匹配数量'),
      new ExportFileHeaderInfo('moStartTime', '开始时间'),
      new ExportFileHeaderInfo('moFinishTime', '完成时间'),
      new ExportFileHeaderInfo('payableQty', '应付数量'),
      new ExportFileHeaderInfo('salesNo', '销售编号'),
      new ExportFileHeaderInfo('sendQty', '发送数量'),
      new ExportFileHeaderInfo('unSendQty', '没发送数量'),
    ],
  },
  KitInfos2: {
    title: 'T2齐套数据',
    api: 'GetZhusuGraphLineDashboard_CompletenessInfos',
    columns: [
      new ColumnItem('moNo', '工单号', '8rem'),
      new ColumnItem('erpWarehouse', 'erp仓库', '9rem'),
      new ColumnItem('itemCategory', '项目分类', '9rem'),
      new ColumnItem('itemCode', '物料编码', '8rem'),
      new ColumnItem('itemName', '物料名称', '15rem'),
      new ColumnItem('lineName', '项目规格', '6rem'),
      new ColumnItem('matchQty', '匹配数量', '6rem'),
      new ColumnItem('moStartTime', '开始时间', '12rem'),
      new ColumnItem('moFinishTime', '完成时间', '12rem'),
      new ColumnItem('payableQty', '应付数量', '6rem'),
      new ColumnItem('salesNo', '销售编号', '6rem'),
      new ColumnItem('sendQty', '发送数量', '6rem'),
      new ColumnItem('unSendQty', '没发送数量', '8rem'),
    ],
    formatter: (data: any[]) => {
      data.forEach((item) => {
        if (item.moStartTime) {
          item.moStartTime = format(
            new Date(item.moStartTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
        if (item.moFinishTime) {
          item.moFinishTime = format(
            new Date(item.moFinishTime),
            'yyyy/MM/dd HH:mm:ss',
          );
        }
      });
      return data;
    },
    exportColumns: [
      new ExportFileHeaderInfo('moNo', '工单号'),
      new ExportFileHeaderInfo('erpWarehouse', 'erp仓库'),
      new ExportFileHeaderInfo('itemCategory', '项目分类'),
      new ExportFileHeaderInfo('itemCode', '物料编码'),
      new ExportFileHeaderInfo('itemName', '物料名称'),
      new ExportFileHeaderInfo('lineName', '项目规格'),
      new ExportFileHeaderInfo('matchQty', '匹配数量'),
      new ExportFileHeaderInfo('moStartTime', '开始时间'),
      new ExportFileHeaderInfo('moFinishTime', '完成时间'),
      new ExportFileHeaderInfo('payableQty', '应付数量'),
      new ExportFileHeaderInfo('salesNo', '销售编号'),
      new ExportFileHeaderInfo('sendQty', '发送数量'),
      new ExportFileHeaderInfo('unSendQty', '没发送数量'),
    ],
  },
  DailyFinishQty: {
    title: '月度完工数',
    api: 'GetZhusuGraphLineDashboard_DailyFinishQty',
    columns: [
      new ColumnItem('lineName', '线路名称', '8rem'),
      new ColumnItem('workDate', '工作日期', '14rem'),
      new ColumnItem('finishQty', '完成数量', '8rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('lineName', '线路名称'),
      new ExportFileHeaderInfo('workDate', '工作日期'),
      new ExportFileHeaderInfo('finishQty', '完成数量'),
    ],
  },
  DailyFinishRate: {
    title: '计划达成率',
    api: 'GetZhusuGraphLineDashboard_DailyFinishRate',
    columns: [
      new ColumnItem('lineName', '线路名称', '8rem'),
      new ColumnItem('workDate', '工作日期', '14rem'),
      new ColumnItem('finishRate', '达成率', '8rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('lineName', '线路名称'),
      new ExportFileHeaderInfo('workDate', '工作日期'),
      new ExportFileHeaderInfo('finishRate', '达成率'),
    ],
  },
  DailyQualifiedRate: {
    title: '一次性合格率',
    api: 'GetZhusuGraphLineDashboard_DailyQualifiedRate',
    columns: [
      new ColumnItem('lineName', '线路名称', '8rem'),
      new ColumnItem('workDate', '工作日期', '14rem'),
      new ColumnItem('qualifiedRate', '合格率', '8rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('lineName', '线路名称'),
      new ExportFileHeaderInfo('workDate', '工作日期'),
      new ExportFileHeaderInfo('qualifiedRate', '合格率'),
    ],
  },
  DailyUpph: {
    title: '月度UPPH值',
    api: 'GetZhusuGraphLineDashboard_DailyUpph',
    columns: [
      new ColumnItem('lineName', '线路名称', '8rem'),
      new ColumnItem('workDate', '工作日期', '14rem'),
      new ColumnItem('upph', 'UPPH值', '8rem'),
    ],
    exportColumns: [
      new ExportFileHeaderInfo('lineName', '线路名称'),
      new ExportFileHeaderInfo('workDate', '工作日期'),
      new ExportFileHeaderInfo('upph', 'UPPH值'),
    ],
  },
};

export const monthTable: DetailTableConfig = {
  title: '月度数据',
  api: '',
  columns: [],
  exportColumns: [
    new ExportFileHeaderInfo('lineName', '产线名称'),
    new ExportFileHeaderInfo('monthFinishQty', '月度完工数'),
    new ExportFileHeaderInfo('monthFinishRate', '计划达成率'),
    new ExportFileHeaderInfo('monthQuantityRate', '一次合格率'),
    new ExportFileHeaderInfo('monthAndonNumber', '安灯停线'),
    new ExportFileHeaderInfo('monthAndonAmount', '异常费用'),
    new ExportFileHeaderInfo('monthInspRate', '验货合格率'),
    new ExportFileHeaderInfo('monthResignationRate', '月度离职率'),
    new ExportFileHeaderInfo('monthUPPH', '月度UPPH值'),
    new ExportFileHeaderInfo(
      'monthBadMaterialReturnAmount',
      '产线退料金额（料费）',
    ),
    new ExportFileHeaderInfo(
      'monthWorkBadMaterialReturnAmount',
      '产线退料金额（工费）',
    ),
    new ExportFileHeaderInfo('energy', '用电统计'),
  ],
};

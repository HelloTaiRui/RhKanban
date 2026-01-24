import { RhSafeAny } from '@model';
import { format } from 'date-fns';

class ColumnItem {
  constructor(public key: string, public title: string, public width: string) {}
}

export interface DetailTableConfig {
  title: string;
  api: string;
  columns: ColumnItem[];
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
          item.moStartTime = format(new Date(item.moStartTime), 'yyyy/MM/dd HH:mm:ss');
        }
        if (item.moFinishTime) {
          item.moFinishTime = format(new Date(item.moFinishTime), 'yyyy/MM/dd HH:mm:ss');
        }
      });
      return data;
    },
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
  },
};

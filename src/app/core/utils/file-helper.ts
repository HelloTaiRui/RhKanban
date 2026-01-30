import {
  RhSafeAny,
  ExportFileHeaderInfo,
  ExportFileStyle,
  WithNil,
} from '@model';
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSXD from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { isNil } from 'lodash';

type RhMimeType = 'text/plain' | 'application/json' | string;

export class FileHelper {
  //#region 文件导出区域

  /**
   * 使用sheetjs导出表格数据
   * @param dataset 要导出的数据列表
   * @param headerInfos 列信息
   * @param fileStyle 样式信息
   * @param sheetName sheet表名称
   * @param filename 文件名
   * @description //TODO: 图片的导出
   */
  static exportTableDataToExcelFile(
    dataset: RhSafeAny[],
    headerInfos: ExportFileHeaderInfo[],
    fileStyle: WithNil<ExportFileStyle>,
    sheetName: string,
    filename: WithNil<string>
  ) {
    /** 表头数据 */
    const headerData: RhSafeAny[] = [];
    /** 表体数据 */
    const aoaData: RhSafeAny[][] = dataset.map((item) => []);
    /** 列数据 */
    const wscols: XLSXD.ColInfo[] = [];
    /**
     * 根据数据值计算列宽
     * @param value 文本数据
     * @returns
     */
    function getCellWidth(value: RhSafeAny) {
      // 判断是否为null或undefined
      if (value == null) {
        return 10;
      } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        // 中文的长度
        const chineseLength = value.match(/[\u4e00-\u9fa5]/g).length;
        // 其他不是中文的长度
        const otherLength = value.length - chineseLength;
        return chineseLength * 2.5 + otherLength * 1.3;
      } else {
        return value.toString().length * 1.3;
      }
    }
    /**
     * 根据原始值计算生成实际值
     * @param value 原始值
     * @param header 当前列信息
     * @param map 管道数据
     * @returns
     */
    function calcValue(
      value: RhSafeAny,
      header: ExportFileHeaderInfo,
      map: Map<RhSafeAny, RhSafeAny>
    ) {
      //不正常的值，直接返回空字符串
      if (typeof value === 'function' || typeof value === 'symbol') return '';
      //检查是否为日期类型的数据
      if (header.FieldValueType === 'dateTime') {
        try {
          if (value === null /*  || value === 0 */) return ''; //new Date(null)等于1970年1月1号，因此要先排除掉。new Date(0)等于1970年1月1日，暂不处理，就放着输出出来。
          if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            value instanceof Date
          ) {
            //只接受字符串、数字、日期类型的数据，其余数据当做异常处理，返回''
            return format(
              new Date(value),
              header.DateFormat || 'yyyy-MM-dd HH:mm'
            );
          } else {
            return ''; //其余类型数据，直接返回''
          }
        } catch (error) {
          //new Date("")等异常数据之类的，是会报错的，然后走到这里。
          return typeof value == 'object' ? '' : value;
        }
      }
      //检查是否为布尔类型
      if (header.FieldValueType === 'boolean')
        return (
          ({ 0: '否', 1: '是', false: '否', true: '是' } as RhSafeAny)[value] ||
          value ||
          ''
        );
      //其余直接检查管道数据
      if (map.has(value)) return map.get(value);
      //最后，空数据需要返回空字符串，否则Excel打开时会报错，触发自动修复。非空数据，如果是对象，就JSON一下再返回，反之直接返回。
      return isNil(value)
        ? ''
        : typeof value == 'object'
        ? JSON.stringify(value)
        : value;
    }
    //遍历表头数据
    headerInfos.forEach((header) => {
      //如果字段key不存在，则跳过。
      if (!header.FieldName) return;
      /** 当前列的管道数据 */
      const map = new Map(
        (header.PipeDatas || []).map((item) => [item.Value, item.Text])
      );
      //初始化管道数据
      //放入当前表头项
      headerData.push({
        v: header.FieldDisplayName || header.FieldName,
        t: 's',
        s: {
          font: {
            name: '宋体',
            sz: 12,
            bold: true,
          },
          fill: {
            fgColor: { rgb: 'c0c0c0' },
          },
          alignment: {
            horizontal: 'center', //"top","bottom"
            vertical: 'center', //"top","bottom"
            wrapText: false,
          },
        },
      });
      //存放该列每项数据的宽度
      const columnWidths: number[] = [
        getCellWidth(header.FieldDisplayName || header.FieldName),
      ]; //计算最大宽度时，要连带表头的宽度也比较进去
      //遍历数据，放入该列的每行数据
      dataset.forEach((data, index) => {
        //计算当前单元格的值
        const value = calcValue(
          data[header.FieldName as RhSafeAny],
          header,
          map
        );
        //放入当前单元格
        aoaData[index].push({
          v: value, //值
          t: header.FieldValueType, //类型, `s`表示string类型，`n`表示number类型，`b`表示boolean类型，`d`表示date类型
          s: {
            //样式.有xlsx-js-style库提供支持，xlsx库需要充钱才能有样式配置功能
            font: {
              name: '宋体',
              sz: 12, //字体大小
            },
            alignment: {
              horizontal: 'center', //"top","bottom"
              vertical: 'center', //"top","bottom"
              wrapText: false,
            },
          },
        });
        //放入当前单元格的列宽
        columnWidths.push(getCellWidth(value));
      });
      //添加列数据
      wscols.push({ wch: Math.max(...columnWidths) }); //取最宽的数据项的宽度为列宽
    });
    //初始化Sheet页
    const worksheet: XLSXD.WorkSheet = XLSXD.utils.aoa_to_sheet([
      headerData,
      ...aoaData,
    ]); //放入表头和表体数据
    //设置列数据
    worksheet['!cols'] = wscols;
    //初始化数据簿
    const workbook: XLSXD.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    };
    //生成数据
    const excelBuffer: any = XLSXD.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //配置文件名
    filename =
      filename ||
      `${filename}_${format(new Date(Date.now()), 'yyyyMMddHHmmss')}`;
    //生成文件下载
    this.saveAsExcelFile({ buffer: excelBuffer, fileName: filename });
  }

  static saveAsExcelFile({
    buffer,
    fileName,
  }: {
    buffer: any;
    fileName: string;
  }) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, fileName + '.xlsx');
  }

  //#endregion 文件导出区域结束

  //#region base download function区域

  /**
   * 通过url直接下载，模拟点击
   * @param url 目标base64数据
   * @deprecated 该方法已废弃，请使用`downloadBase64Directly`方法
   */
  static downloadDirect(url: string) {
    const aTag = document.createElement('a');
    // download为filename
    aTag.download = url.split('/').pop() as string;
    aTag.href = url;
    aTag.click();
  }

  /**
   * 通过url直接下载，模拟点击
   * @param url 目标base64数据
   * @deprecated 该方法已废弃，请使用`downloadBase64Directly`方法
   */
  static downloadBase64Directly(url: string) {
    const aTag = document.createElement('a');
    // download为filename
    aTag.download = url.split('/').pop() as string;
    aTag.href = url;
    aTag.click();
  }
  /**
   * 使用后端提供的url。模拟点击超链接进行下载
   * @param url 后端提供的url,需要在浏览器中直接输入就能下载文件。
   * @param fileName 文件名，选填
   */
  static downloadUrlDirectly(url: string, fileName?: string) {
    const anchor = document.createElement('a');
    if (fileName) {
      anchor.download = fileName;
    }
    anchor.href = url;
    anchor.click();
  }

  /**
   *
   * @param content 数据源,如JSON数据
   * @param filename 文件名称,如：hello.json,hello.txt
   * @param type 文件类型(MIME 类型)
   */
  static downloadByContent(
    content: RhSafeAny,
    filename: string,
    type: RhMimeType
  ) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    const blob = new Blob([content], { type });
    const blobUrl = URL.createObjectURL(blob);
    aTag.href = blobUrl;
    aTag.click();
    URL.revokeObjectURL(blobUrl);
  }

  static downloadByDataUrl(
    content: RhSafeAny,
    filename: string,
    type: RhMimeType
  ) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    const dataUrl = `data:${type};base64,${window.btoa(
      unescape(encodeURIComponent(content))
    )}`;
    aTag.href = dataUrl;
    aTag.click();
  }

  static downloadByBlob(blob: Blob, filename: string) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    const blobUrl = URL.createObjectURL(blob);
    aTag.href = blobUrl;
    aTag.click();
    URL.revokeObjectURL(blobUrl);
  }

  static base64ToBlob(base64: string, type?: RhMimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const buffer = Uint8Array.from(byteNumbers);
    const blob = new Blob([buffer], type ? { type } : void 0);
    return blob;
  }

  static base64ToFile(base64: string, filename: string) {
    const arr = base64.split(',');
    // 从base64的数据中获取type
    const mime = arr[0].match(/:(.*?);/)?.[1] as string;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  /** 将文件或者blob转换成base64
   * @description 读取成功会返回base64信息，读取失败后会返错误信息
   * @param data:blob或者file对象
   */
  static blobOrFileToBase64(
    data: Blob | File
  ): Promise<string | ArrayBuffer | null> {
    const p: Promise<string | ArrayBuffer | null> = new Promise(function (
      resolve,
      reject
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(data as RhSafeAny);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (e) => {
        reject(`读取文件失败!${e}`);
      };
    });
    return p;
  }
  //#endregion base download function区域结束
}

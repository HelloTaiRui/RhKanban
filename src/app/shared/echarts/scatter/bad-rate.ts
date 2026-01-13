import { RhEchartsChart, RhSafeAny } from '@model';
import { EChartsOption, graphic, ScatterSeriesOption } from 'echarts';
import {
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardValueXAXis,
  useStandardValueYAXis,
} from '../utils';

export class RhBadRateScatterChart<Dataset> extends RhEchartsChart<
  RhBadRateScatterChart<Dataset>
> {
  dimensions: string[] = ['数量'];
  dataset = [] as RhSafeAny;

  /** y轴名称 */
  yAxisName: string = '';

  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhBadRateScatterChart<Dataset>>,
    rate: number
  ): EChartsOption {
    const yMax = Math.max(
      ...c.dataset.map((row) =>
        Math.max(...c.dimensions.slice(1).map((item, i) => row[i + 1]))
      )
    );
    const xMax = Math.max(...c.dataset.map((item) => item[0]));
    return {
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          color: '#fff',
        },
        backgroundColor: 'rgba(16, 123, 184, .52)', //设置背景颜色
        confine: true,
      },
      dataset: {
        source: c.datasetSource,
      },
      grid: useStandardGrid(rate),
      legend: useStandardHorizontalLegend(rate),
      xAxis: useStandardValueXAXis(
        rate,
        undefined,
        true,
        '{value}',
        c.splitNumber,
        xMax
      ),
      yAxis: useStandardValueYAXis(
        rate,
        c.yAxisName,
        true,
        c.yAxisNameFormatter,
        c.splitNumber,
        yMax
      ),
      series: c.series.map((item) => {
        return {
          type: 'scatter',
          name: item,
          encode: {
            x: c.dimensions[0], // 使用 'Sales' 列作为 x 轴数据
            y: item, // 使用 'Market Share' 列作为 y 轴数据
          },
          symbolSize:
            10 * rate /* (value: Array<number> | number, params: Object) => {
            console.log(value, params);
            return 10;
          } */, // 设置散点大小
        } as ScatterSeriesOption;
      }),
    };
  }
}

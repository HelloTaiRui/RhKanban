import { RhEchartsChart } from '@model';
import { EChartsOption } from 'echarts';
import {
  useStandardBarLabel,
  useStandardBarWidth,
  useStandardCategoryYAXis,
  useStandardGrid,
  useStandardHorizontalLegend,
  useStandardTooltip,
  useStandardValueXAXis,
} from '../utils';

export class RhLeftRightComparisonBarChart<DataRow> extends RhEchartsChart<
  RhLeftRightComparisonBarChart<DataRow>
> {
  public mediaQueryBaseValue: { minWidth: number; minHeight: number } = {
    minWidth: 420,
    minHeight: 300,
  };

  protected createBaseOption(
    c: Partial<RhLeftRightComparisonBarChart<DataRow>>,
    rate: number
  ): EChartsOption {
    const barMax =
      Math.max(
        ...c.dataset.map((row) =>
          Math.max(...c.dimensions.slice(1, 3).map((item, i) => row[i + 1]))
        )
      ) * 1.1;
    return {
      grid: [
        this.merge(useStandardGrid(rate), {
          top: 60 * rate,
          right: '50%',
        }),
        this.merge(useStandardGrid(rate), {
          top: 60 * rate,
          left: '50%',
        }),
      ],
      dataset: {
        source: c.datasetSource,
      },
      tooltip: useStandardTooltip(rate),
      color: c.colors,
      legend: useStandardHorizontalLegend(rate),
      xAxis: [
        this.merge(
          useStandardValueXAXis(
            rate,
            c.xAXisName,
            true,
            '{value}',
            c.splitNumber,
            barMax
          ),
          {
            inverse: true,
            gridIndex: 0,
          }
        ),
        this.merge(
          useStandardValueXAXis(
            rate,
            this.xAXisName,
            true,
            '{value}',
            c.splitNumber,
            barMax
          ),
          {
            gridIndex: 1,
          }
        ),
      ],
      yAxis: [
        this.merge(useStandardCategoryYAXis(rate, c.yAxisName, false), {
          gridIndex: 0,
        }),
        this.merge(useStandardCategoryYAXis(rate, c.yAxisName, false), {
          gridIndex: 1,
          axisLabel: {
            show: false,
          },
        }),
      ],
      series: c.dimensions.slice(1, 3).map((row, index) => {
        return {
          type: 'bar',
          barWidth: useStandardBarWidth(rate),
          barGap: 0.5 * rate,
          xAxisIndex: index,
          yAxisIndex: index,
          label: useStandardBarLabel(rate),
        };
      }),
    };
  }
}

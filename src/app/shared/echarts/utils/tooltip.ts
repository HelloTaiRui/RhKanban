import { RhSafeAny } from '@model';
import { TooltipComponentOption } from 'echarts';

export const useStandardTooltip = (rate: number, formatter?: RhSafeAny) => {
  const tmp: TooltipComponentOption = {
    show: true,
    padding: 14 * rate,
    textStyle: {
      fontSize: 14 * rate,
      lineHeight: 14 * rate,
      color: '#fff',
    },
    formatter: formatter,
    trigger: 'axis',
    confine: false,
    backgroundColor: '#0D365D',
    shadowColor: 'rgba(7, 131, 250, 0.40)',
    shadowBlur: -20 * rate,
    borderWidth: 0,
  };
  return tmp;
};

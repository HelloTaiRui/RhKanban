import { RhSafeAny } from '@model';

export const useStandardBarLabel = (
  rate: number,
  show: boolean = true,
  position: RhSafeAny = 'outside'
) => {
  return {
    show: show,
    fontSize: 14 * rate,
    backgroundColor: 'transparent',
    color: '#fff',
    position: position,
  };
};

export const useStandardLineLabel = (
  rate: number,
  formatter?: RhSafeAny,
  position: RhSafeAny = 'top'
) => {
  return {
    show: true,
    fontSize: 14 * rate,
    backgroundColor: 'transparent',
    color: '#fff',
    position: position,
    formatter: formatter,
  };
};

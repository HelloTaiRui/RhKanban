import { configinfo } from '@configs';

export enum RhColor {
  Primary = '#0783fa',
  Secondary = '#0fd1fa',
  Success = '#20e6a4',
  Warning = '#ffd15c',
  Danger = '#EE6F7C',//'#ff2e2e',
  Other1 = '#ff822e',
  Other2 = '#ffc166',
  Gray = '#ABD6FF',
}

export const defaultColorList = [
  RhColor.Primary,
  RhColor.Secondary,
  RhColor.Warning,
  RhColor.Success,
  RhColor.Danger,
  RhColor.Other1,
  RhColor.Other2,
  RhColor.Gray,
];

export const useStandardBarWidth = (rate: number) => 12 * rate;

export const symbolResources = {
  Success: (prefix: string = 'image://') =>
    `${prefix}${configinfo.browserSideWebsiteAddress}assets/img/biyi/Success_Symbol.png`,
  Primary: (prefix: string = 'image://') =>
    `${prefix}${configinfo.browserSideWebsiteAddress}assets/img/biyi/Primary_Symbol.png`,
  Warning: (prefix: string = 'image://') =>
    `${prefix}${configinfo.browserSideWebsiteAddress}assets/img/biyi/Warning_Symbol.png`,
};

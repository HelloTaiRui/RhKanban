import { RhBoardData } from '@model';
import { format } from 'date-fns';

export const enableMock = false;

export enum RhEquipmentStatus {
  Running = 1,
  StandBy = 2,
  Down = 3,
  /** 异常 */
  Error = 4,
  Unknown = 0,
  /** 休息 */
  Rest = 5,
}

export const equipmentStatusIconMap = {
  [RhEquipmentStatus.Running]: 'running',
  [RhEquipmentStatus.Unknown]: 'standby',
  [RhEquipmentStatus.Down]: 'down',
  [RhEquipmentStatus.StandBy]: 'error',
};

export const equipmentStatusNameMap = {
  [RhEquipmentStatus.Running]: '运行',
  [RhEquipmentStatus.Unknown]: '未知',
  [RhEquipmentStatus.Down]: '停机',
  [RhEquipmentStatus.StandBy]: '待机',
  [RhEquipmentStatus.Error]: '异常',
  [RhEquipmentStatus.Rest]: '休息',
};

export const timelineTicks = [
  [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ],
  [
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
  ],
];

export const fullDayTimelineTicks = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const workTimelineTicks = [
  '07:30',
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
  '17:30',
  '18:30',
  '19:30',
  '20:30',
];

export const useWorkStartTime = (curTime: Date) =>
  new Date(format(new Date(curTime), 'yyyy/MM/dd 07:30:00')).getTime();

export const useWorkEndTime = (curTime: Date) =>
  new Date(format(new Date(curTime), 'yyyy/MM/dd 21:30:00')).getTime();

export const enum RhBasicFragmentSize {
  Monthly = 10,
  Daily = 20,
  LastSevenDay = 7,
  LastMonth = 30,
}

export const monitorData = [
  [
    {
      indexCode: '4ac5db12930e4fbdaa2a816cdcaaeac4',
      regionIndexCode: 'fa053fb4b65d4608bca81b8ab14415fe',
      name: '6#2F-NET4-2FJK-6(235.58)',
      parentIndexCode: 'bc0f140b257f4008a425877893f1d717',
      cameraType: 0,
      chanNum: 1,
      dacIndexCode: '--',
      capability:
        '@event_vss@io@record@vss@event_io@net@maintenance@event_device@status@',
      channelType: 'analog',
      decodeTag: 'hikvision',
      resourceType: 'camera',
      createTime: '2025-04-29T08:33:24.858+08:00',
      updateTime: '2025-04-29T08:40:18.648+08:00',
      sort: 80,
      disOrder: 80,
      cameraRelateTalk: '33f5687e31f341a3bdc4092191996712',
      transType: 1,
      treatyType: 'hiksdk_net',
      recordLocation: '0',
      cascadeType: 0,
      channelMainType: 'camera',
      regionName: '二层',
      regionPath:
        '@root000000@e9b280cbff214f89a6a08e9aafd8f1e9@fa053fb4b65d4608bca81b8ab14415fe@',
      regionPathName: '比依/六号楼（厂房）/二层',
    },
  ],
  [
    {
      indexCode: '432f1fa527de4c7ea193f8ec1e5240a1',
      regionIndexCode: 'fa053fb4b65d4608bca81b8ab14415fe',
      name: '6#2F-NET7-JK3(235.106)',
      parentIndexCode: '096fa4ba99fa4605ba40934a7b403a60',
      longitude: '',
      latitude: '',
      cameraType: 0,
      installLocation: '',
      chanNum: 1,
      dacIndexCode: '--',
      capability:
        '@event_vss@io@record@vss@event_io@net@maintenance@event_device@status@',
      channelType: 'analog',
      decodeTag: 'hikvision',
      resourceType: 'camera',
      createTime: '2025-10-04T10:02:19.798+08:00',
      updateTime: '2025-10-04T10:14:28.724+08:00',
      sort: 2289,
      disOrder: 2289,
      cameraRelateTalk: 'b665a20ba5164f98bd2d0f6e84e99198',
      transType: 1,
      treatyType: 'hiksdk_net',
      recordLocation: '0',
      cascadeType: 0,
      addressDesc: '',
      channelMainType: 'camera',
      regionName: '二层',
      regionPath:
        '@root000000@e9b280cbff214f89a6a08e9aafd8f1e9@fa053fb4b65d4608bca81b8ab14415fe@',
      regionPathName: '比依/六号楼（厂房）/二层',
    },
  ],
  [
    {
      indexCode: 'ebcd2e68be3b48fcb99ae3653b40c206',
      regionIndexCode: '13de602048b94ad6baafeaa4d4ed16b6',
      name: '8#2F-NET2-1FJK-2(233.13)',
      parentIndexCode: 'e9f1bf3c58854512949e3e780ed7cbaf',
      longitude: '',
      latitude: '',
      cameraType: 0,
      installLocation: '',
      chanNum: 1,
      dacIndexCode: '--',
      capability:
        '@event_vss@io@record@vss@event_io@net@maintenance@event_device@status@',
      channelType: 'analog',
      decodeTag: 'hikvision',
      resourceType: 'camera',
      createTime: '2025-06-23T11:32:59.936+08:00',
      updateTime: '2025-06-30T14:24:44.894+08:00',
      sort: 847,
      disOrder: 847,
      cameraRelateTalk: 'aec5cbd090804b79b54513aa7e48d903',
      transType: 1,
      treatyType: 'hiksdk_net',
      recordLocation: '0',
      cascadeType: 0,
      addressDesc: '',
      channelMainType: 'camera',
      regionName: '一层',
      regionPath:
        '@root000000@ff03a9b64aab42158dc9d494e992dba4@13de602048b94ad6baafeaa4d4ed16b6@',
      regionPathName: '比依/八号楼（厂房）/一层',
    },
  ],
  [
    {
      indexCode: '4ee34b6ec73147fcb3fa80d6a498dfe2',
      regionIndexCode: '06e88caaadce44bfa7d3670ced890b90',
      name: '4#2F-NET3-4FJK-1(237.23)',
      parentIndexCode: 'b9c94b7ddbd34c0a8b0a5a67f59d70dc',
      longitude: '',
      latitude: '',
      cameraType: 0,
      installLocation: '',
      chanNum: 1,
      dacIndexCode: '--',
      capability:
        '@event_vss@io@record@vss@event_io@net@maintenance@event_device@status@',
      channelType: 'analog',
      decodeTag: 'hikvision',
      resourceType: 'camera',
      createTime: '2025-06-30T13:54:40.885+08:00',
      updateTime: '2025-06-30T14:06:30.624+08:00',
      sort: 1133,
      disOrder: 1133,
      cameraRelateTalk: '30804301a9ac4680a48d3ce11a1930fb',
      transType: 1,
      treatyType: 'hiksdk_net',
      recordLocation: '0',
      cascadeType: 0,
      addressDesc: '',
      channelMainType: 'camera',
      regionName: '四层',
      regionPath:
        '@root000000@521c88b0b99b44d79de7deef0af8ee65@06e88caaadce44bfa7d3670ced890b90@',
      regionPathName: '比依/四号楼（厂房）/四层',
    },
  ],
];

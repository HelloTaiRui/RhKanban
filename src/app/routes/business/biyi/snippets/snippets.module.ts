import { NgModule } from '@angular/core';
import { RhMonitorComponent } from './monitor/monitor.component';
import { SharedModule } from '@shared';
import {
  NzButtonModule,
  NzIconModule,
  NzInputModule,
  NzModalModule,
} from 'ng-zorro-antd';
import { RhMeixiangDigitalTwinComponent } from './meixiang-digital-twin/meixiang-digital-twin.component';

@NgModule({
  declarations: [RhMonitorComponent, RhMeixiangDigitalTwinComponent],
  imports: [
    SharedModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  exports: [RhMonitorComponent, RhMeixiangDigitalTwinComponent],
})
export class RhBiYiSnippetsModule {}

/**
 * @ Author: zhoujs
 * @ Create Time: 2021-04-21 08:48:33
 * @ Modified by: zhoujs
 * @ Modified time: 2026-01-12 15:38:18
 * @ Description:
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { SelectItemPipe, StatusBackgroundPipe } from './pipes';
import { MovableDirective, RhvBoardBase } from './directives';
import { FormsModule } from '@angular/forms';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { RhPageFrameComponent } from './components/page-frame/page-frame.component';
import { RhItemContainerComponent } from './components/item-container/item-container.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { RhRankTableComponent } from './components/rank-table/rank-table.component';
import {
  NzPopoverModule,
  NzRadioModule,
  NzTableModule,
  NzToolTipModule,
} from 'ng-zorro-antd';
import { RhSegmentComponent } from './components/segment/segment.component';
import { EmptyModule } from './components';
import { RhRulerComponent } from './components/ruler/ruler.component';
import { RhStatusTimelineComponent } from './components/status-timeline/status-timeline.component';
import { RhOverviewComponent } from './components/overview/overview.component';

const COMPONENTS: Type<any>[] = [
  VideoPlayerComponent,
  RhPageFrameComponent,
  RhItemContainerComponent,
  RhRankTableComponent,
  RhSegmentComponent,
  RhRulerComponent,
  RhStatusTimelineComponent,
  RhOverviewComponent
];

const DIRECTIVED: Type<any>[] = [MovableDirective, RhvBoardBase];

const PIPES: Type<any>[] = [SelectItemPipe, StatusBackgroundPipe];

const NZ_MODULES = [
  NzTableModule,
  NzRadioModule,
  NzToolTipModule,
  NzPopoverModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, EmptyModule, ...NZ_MODULES],
  declarations: [...COMPONENTS, ...DIRECTIVED, ...PIPES],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    NgxEchartsModule,
    ...COMPONENTS,
    ...DIRECTIVED,
    ...PIPES,
    ...NZ_MODULES,
  ],
  entryComponents: [...COMPONENTS],
})
export class SharedModule {}

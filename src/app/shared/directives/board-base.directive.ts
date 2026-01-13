import { Directive } from '@angular/core';
import { RhBusinessApiService } from '@core';
import { RhBoardBase } from '@model';

/** 看板页面基类 */
@Directive({ selector: 'rhvBoardBase' })
export class RhvBoardBase extends RhBoardBase {
  constructor(public apiSer: RhBusinessApiService) {
    super();
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }
}

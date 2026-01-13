import { Component, OnInit } from '@angular/core';
import { configinfo } from '@configs';
import { RhvOverviewItemConfig, staticPreviewItems } from '@model';

@Component({
  selector: 'rhv-overview-page',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
})
export class OverviewComponent implements OnInit {
  item: RhvOverviewItemConfig;

  ngOnInit(): void {
    this.item = {
      route: null,
      direction: 'row',
      children: [],
    };

    staticPreviewItems.length = 0;
    staticPreviewItems.push(
      ...(configinfo.projectConfig.overviewStaticItems || []).map((item) => {
        return {
          ...item,
          route: item.route.replace(
            '${root}',
            location.href.replace('/overview', '')
          ),
        };
      })
    );
    this.item.children.unshift(...staticPreviewItems);
  }
}

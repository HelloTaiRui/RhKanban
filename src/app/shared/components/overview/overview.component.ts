import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RhvOverviewItemConfig } from '@model';

@Component({
  selector: 'rh-overview',
  templateUrl: './overview.component.html'
})
export class RhOverviewComponent implements OnInit, AfterViewInit, OnChanges {
  /** 配置信息 */
  @Input()
  rhvConfig: RhvOverviewItemConfig;
  /** 配置信息json文件所在地址 */
  @Input()
  rhvConfigSrc: string;

  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;

  curTabIndex: number = 1;

  constructor(
    private render: Renderer2,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init(changes.rhvConfig?.currentValue, changes.rhvConfigSrc?.currentValue)
  }
  ngOnInit(): void {
  }

  async init(config: RhvOverviewItemConfig = this.rhvConfig, configSrc: string = this.rhvConfigSrc) {
    if (!this.container) return;
    if (config) {

    } else {
      if (configSrc) {
        config = await fetch(configSrc).then(res => res.json());
      }
    }
    if (!config) return;
    const root = this.renderPage(config);
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.flexWrap = "wrap";
    root.style.overflow = "hidden";
    this.container.nativeElement.innerHTML = "";
    this.render.appendChild(this.container.nativeElement, root);
  }

  renderPage(config: RhvOverviewItemConfig) {
    let div: HTMLDivElement = this.render.createElement("div");
    this.render.addClass(div, `rhv-flex-${config.direction || "row"}`);
    //this.render.addClass(div, "rhv-full-size");
    //this.render.setStyle(div, "flex", config.flex || 1);
    this.render.setStyle(div, "border", config.border || "1px solid red");
    this.render.setStyle(div, "flexWrap", "wrap");
    if (config.src) {
      let img: HTMLImageElement = this.render.createElement("img");
      img.src = config.src;
      this.render.setAttribute(img, "width", "100%");
      this.render.setAttribute(img, "height", "100%");
      this.render.appendChild(div, img);
    }
    if (config.title && config.showTitle) {
      let note: HTMLDivElement = this.render.createElement("div");
      this.render.addClass(note, "rhv-overview-note");
      this.render.appendChild(note, this.render.createText(config.title));
      this.render.appendChild(div, note);
    }

    if (config.children && config.children.length > 0) {
      const colPercent = Math.ceil(Math.sqrt(config.children.length));
      const rowPercent = Math.ceil(config.children.length / colPercent);
      config.children.forEach((item, index) => {
        let child = this.renderPage(item);
        child.style.width = (100 / colPercent) + "%"
        child.style.height = (100 / rowPercent) + "%"
        this.render.appendChild(div, child);
      });
    } else {
      this.render.addClass(div, "rhv-cursor-pointer");
      this.render.setStyle(div, "position", "relative");
      this.render.setAttribute(div, "tabindex", (this.curTabIndex++).toString());
      if (config.route) {
        this.render.listen(div, "click", () => {
          if (config.isOpenInCurPage) {
            this.router.navigate([config.route]);
          } else {
            window.open(`${config.route}`, "_blank");
          }
        })
      }
    }
    return div;
  }

}

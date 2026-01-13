import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[rhvMovable]'
})
export class MovableDirective {

  @Input() rhEnableRightClickMode: boolean = false;

  private lastPosX: number = 0;
  private lastPosY: number = 0;
  private detX: number = 0;
  private detY: number = 0;

  constructor(private el: ElementRef<HTMLElement>) {
    //el.nativeElement.style.cursor="move";
    setTimeout(() => {
      let header = this.el.nativeElement.querySelector("[rhvMovableHeader]");
      //console.log(header,this.el.nativeElement);
      let dst = header as any || el.nativeElement;
      dst.style.cursor = "move";
      const onMouseMove = (e) => {
        let el = this.el.nativeElement;
        this.detX = this.lastPosX - e.clientX;
        this.detY = this.lastPosY - e.clientY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        el.style.top = (el.offsetTop - this.detY) + "px";
        el.style.left = (el.offsetLeft - this.detX) + "px";
      }
      const onMouseUp = (e) => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
      const onMouseDown = (e) => {
        if (e.button != 2 && this.rhEnableRightClickMode) return;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
      dst.addEventListener("mousedown", onMouseDown);
      dst.addEventListener("contextmenu", (e: MouseEvent) => {
        if (this.rhEnableRightClickMode) e.preventDefault();
      })
    });

  }


}

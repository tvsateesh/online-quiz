import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeBg]'
})
export class ChangeBgDirective {
  @Input() isCorrect: Boolean = false;
  constructor(private el:ElementRef, private rederer: Renderer2 ) { }
  @HostListener('click') answer(){
    if ( this.isCorrect ) {
      this.rederer.setStyle(this.el.nativeElement,'background','green');
      this.rederer.setStyle(this.el.nativeElement,'color','#fff');
      this.rederer.setStyle(this.el.nativeElement,'border','2px solid gray');
    }else {
      this.rederer.setStyle(this.el.nativeElement,'background','red');
      this.rederer.setStyle(this.el.nativeElement,'color','#fff');
      this.rederer.setStyle(this.el.nativeElement,'border','2px solid gray');
    }
  }
}

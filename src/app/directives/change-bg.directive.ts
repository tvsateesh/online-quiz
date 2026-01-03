import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeBg]'
})
export class ChangeBgDirective {
  @Input() isCorrect: Boolean = false;
  constructor(private el:ElementRef, private rederer: Renderer2 ) { }
  @HostListener('click') answer(){
    if ( this.isCorrect ) {
      // Correct answer styling
      this.rederer.setStyle(this.el.nativeElement,'background','linear-gradient(135deg, #10b981 0%, #059669 100%)');
      this.rederer.setStyle(this.el.nativeElement,'color','#fff');
      this.rederer.setStyle(this.el.nativeElement,'border','3px solid #059669');
      this.rederer.setStyle(this.el.nativeElement,'transform','scale(1.02)');
      this.rederer.setStyle(this.el.nativeElement,'box-shadow','0 8px 24px rgba(16, 185, 129, 0.4)');
      
      // Update option check mark
      const checkMark = this.el.nativeElement.querySelector('.option-check');
      if (checkMark) {
        this.rederer.setStyle(checkMark, 'background', '#fff');
        this.rederer.setStyle(checkMark, 'color', '#10b981');
        this.rederer.setStyle(checkMark, 'border-color', '#fff');
      }
      
      // Update option letter
      const letter = this.el.nativeElement.querySelector('.option-letter');
      if (letter) {
        this.rederer.setStyle(letter, 'background', '#fff');
        this.rederer.setStyle(letter, 'color', '#10b981');
      }
    }else {
      // Incorrect answer styling
      this.rederer.setStyle(this.el.nativeElement,'background','linear-gradient(135deg, #ef4444 0%, #dc2626 100%)');
      this.rederer.setStyle(this.el.nativeElement,'color','#fff');
      this.rederer.setStyle(this.el.nativeElement,'border','3px solid #dc2626');
      this.rederer.setStyle(this.el.nativeElement,'transform','scale(1.02)');
      this.rederer.setStyle(this.el.nativeElement,'box-shadow','0 8px 24px rgba(239, 68, 68, 0.4)');
      
      // Update option check mark
      const checkMark = this.el.nativeElement.querySelector('.option-check');
      if (checkMark) {
        this.rederer.setStyle(checkMark, 'background', '#fff');
        this.rederer.setStyle(checkMark, 'color', '#ef4444');
        this.rederer.setStyle(checkMark, 'border-color', '#fff');
      }
      
      // Update option letter
      const letter = this.el.nativeElement.querySelector('.option-letter');
      if (letter) {
        this.rederer.setStyle(letter, 'background', '#fff');
        this.rederer.setStyle(letter, 'color', '#ef4444');
      }
    }
  }
}

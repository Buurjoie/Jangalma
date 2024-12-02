import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGreenStrong]'
})
export class GreenStrongDirective {

  constructor(private el: ElementRef) {
    const elements = el.nativeElement.querySelectorAll('strong');
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.color = 'green';
    }
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value:string = 'X';
  rando = Math.random();
  constructor() {
    setInterval(()=> this.rando = Math.random(),1000);
  }

}

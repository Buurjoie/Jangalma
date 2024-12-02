import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confi',
  templateUrl: './confi.component.html',
  styleUrls: ['./confi.component.scss'],
})
export class ConfiComponent  implements OnInit {
  email:string="contact@jangalma.net";
  constructor() { }

  ngOnInit() {}

}

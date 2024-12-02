import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  data: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getData().subscribe(data => {
      this.data = data;
    });
  }

  getData() {
    let url = 'https://consultel.sn/wp-json/api/v1/';
    return this.http.get(url);
  }

}

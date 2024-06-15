import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.css'],
})
export class LoaderPage implements OnInit {

  constructor() { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}

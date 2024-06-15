import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss', './settings.page.css'],
})
export class SettingsPage implements OnInit {
  menuType: string = 'push';

  constructor() {}

  ngOnInit() {
    console.log("running from settings");
  }

}

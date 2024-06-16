import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-greenguard',
  templateUrl: './about-greenguard.component.html',
  styleUrls: ['./about-greenguard.component.scss'],
})
export class AboutGreenguardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("running from about greenguard component");

  }

}

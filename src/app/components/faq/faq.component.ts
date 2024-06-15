import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent  implements OnInit {

  currentOpen: string | null = null;

  constructor() { }

  ngOnInit() {
    console.log("running from faq component");
  }

  toggleAccordion(id: string) {
    this.currentOpen = this.currentOpen === id ? null : id;
  }

}
